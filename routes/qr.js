const express = require("express");
const router = express.Router();
var QRCode = require("qrcode");

const mongoose = require("mongoose");
const QRModel = require("../models/qr");
const {
  saveQRToDatabase,
  adminDeleteAllQRs,
  checkForBadURLS,
  getAllQRsFromDatabase,
  getGroupFromDatabase,
  detectDuplicateQR,
} = require("./lib");

const allQRCodes = [];
let allTimeQRs = 0;
let allTimeScans = 0;

//? call once to clear database
//adminDeleteAllQRs();

router.get("/all", async (req, res) => {
  //const returnQRs = allQRCodes.filter((qr) => !qr.protected);
  const returnQRs = await getAllQRsFromDatabase();
  res.json({ allQRS: returnQRs, allTimeQRs, allTimeScans });
});

router.post("/code", (req, res) => {
  const code = req.body.code;
  const returnQRs = getGroupFromDatabase(code);

  res.json({ codeQRs: returnQRs, allTimeQRs, allTimeScans, erorr: "" });
});

router.get("/visit/:url", async (req, res) => {
  let visitUrl = req.params.url;
  let decodedUrl = decodeURIComponent(visitUrl);

  let QR = await QRModel.find((QR) => QR.url == decodedUrl);

  if (QR) {
    QR.count += 1;
    allTimeScans += 1;
    res.redirect(`${QR.url}`);
  } else {
    res.json({ message: "This redirect does not exist.", error: "" });
  }
});

router.post("/create", async (req, res) => {
  if (!req.body) {
    res.json({ message: "Something is wrong", error: "No request body" });
  }

  let returnData = {
    message: "",
    QR: "",
    error: "",
  };

  const createUrl = req.body.url;
  const createCode = req.body.code;
  const createProtected = req.body.protected;

  // if bad/nsfw url
  if (checkForBadURLS(createUrl, createCode)) {
    returnData.error = "Do not create NSFW QRS";
    res.json(returnData);
  }
  // if duplicate url
  if (detectDuplicateQR(createUrl, createCode)) {
    returnData.error = "You cannot create duplicate QR's";
    res.json(returnData);
  }
  // create qr
  try {
    let encodedUrl = encodeURIComponent(createUrl);

    QRCode.toDataURL(
      `${process.env.URL}/qr/visit/${encodedUrl}`,
      function (err, url) {
        newQR = {
          qr: url,
          url: createUrl,
          count: 0,
          code: createCode,
          protected: createProtected,
        };
        allQRCodes.push(newQR);
        saveQRToDatabase(newQR);
        returnData.QR = newQR;
        returnData.message = "Successful!";
        allTimeQRs += 1;
        returnData.allTimeScans = allTimeScans;
        returnData.allTimeQRs = allTimeQRs;
        res.json(returnData);
      }
    );
  } catch (err) {
    console.error("Error creating QR Code", err);
    returnData.error = err;
    res.json(returnData);
  }
});

module.exports = router;
