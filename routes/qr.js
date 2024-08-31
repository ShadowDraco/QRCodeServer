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
  getStatsFromDatabase,
  detectDuplicateQR,
  adminCreateStats,
  updateQRsInDatabase,
  updateQRCount,
  updateScansInDatabase,
} = require("./lib");

//? call once to clear database
//adminDeleteAllQRs();
//? Call once to create stats in database (needs to be done if the stats are completely deleted)
//adminCreateStats();
router.get("/all", async (req, res) => {
  const returnQRs = await getAllQRsFromDatabase();
  const [allTimeQRs, allTimeScans] = await getStatsFromDatabase();
  res.json({ allQRS: returnQRs, allTimeQRs, allTimeScans });
});

router.post("/code", async (req, res) => {
  const code = req.body.code;
  const returnQRs = getGroupFromDatabase(code);
  const [allTimeQRs, allTimeScans] = await getStatsFromDatabase();
  res.json({ codeQRs: returnQRs, allTimeQRs, allTimeScans, erorr: "" });
});

router.get("/visit/:url/:code", async (req, res) => {
  let visitUrl = req.params.url;
  let decodedUrl = decodeURIComponent(visitUrl);
  let visitCode = req.params.code;
  let decodedCode = decodeURIComponent(visitCode);

  let QR = await QRModel.find({ url: decodedUrl, code: decodedCode });

  if (QR) {
    updateQRCount(QR);
    updateScansInDatabase();
    res.redirect(`${QR.url}`);
  } else {
    res.json({ message: "This redirect does not exist.", error: "" });
  }
});

router.post("/create", async (req, res) => {
  // if there is an error don't create qr
  let hasError = false;

  let returnData = {
    message: "",
    QR: "",
    error: "",
  };

  if (!req.body) {
    hasError = true;
    returnData.error = "Bad Request";
  }

  const createUrl = req.body.url;
  const createCode = req.body.code;
  const createProtected = req.body.protected;

  // if bad/nsfw url
  if (checkForBadURLS(createUrl, createCode)) {
    hasError = true;
    returnData.error = "Do not create NSFW QRS";
  }
  // if duplicate url
  if (await detectDuplicateQR(createUrl, createCode)) {
    hasError = true;
    returnData.error = "You cannot create duplicate QR's";
  }
  // create qr
  if (!hasError) {
    try {
      let encodedUrl = encodeURIComponent(createUrl);
      let encodedCode = encodeURIComponent(createCode);
      QRCode.toDataURL(
        `${process.env.URL}/qr/visit/${encodedUrl}/${encodedCode}`,
        function (err, url) {
          newQR = {
            qr: url,
            url: createUrl,
            count: 0,
            code: createCode,
            protected: createProtected,
          };
          saveQRToDatabase(newQR);
          updateQRsInDatabase();
          returnData.QR = newQR;
          returnData.message = "Successful!";
        }
      );
    } catch (err) {
      console.error("Error creating QR Code", err);
      returnData.error = err;
    }
  }
  const [allTimeQRs, allTimeScans] = await getStatsFromDatabase();
  returnData.allTimeQRs = allTimeQRs;
  returnData.allTimeScans = allTimeScans;
  res.json(returnData);
});

module.exports = router;
