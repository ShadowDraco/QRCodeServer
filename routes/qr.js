const express = require("express");
const router = express.Router();
var QRCode = require("qrcode");

const allQRCodes = [];
let allTimeQRs = 0;
let allTimeScans = 0;

router.get("/all", (req, res) => {
  // TODO - Filter by password
  res.json({ allQRS: allQRCodes, allTimeQRs, allTimeScans });
});

router.get("/visit/:url", (req, res) => {
  let visitUrl = req.params.url;
  let decodedUrl = decodeURIComponent(visitUrl);

  let QR = allQRCodes.find((QR) => QR.url == decodedUrl);

  if (QR) {
    QR.count += 1;
    allTimeScans += 1;
    res.redirect(`${QR.url}`);
  } else {
    res.json({ message: "This redirect does not exist.", error: "" });
  }
});

router.post("/create", async (req, res) => {
  let returnData = {
    message: "",
    QR: "",
    error: "",
  };

  if (!req.body) {
    console.error("NO Request Body");
    res.json({ message: "Something is wrong", error: "No request body" });
  }

  const createUrl = req.body.url;
  const createCode = req.body.code;
  const createProtected = req.body.protected;

  // if duplicate url
  if (allQRCodes.find((QR) => QR.url == createUrl)) {
    console.error("Duplicate QR");
    returnData.message = "You cannot create duplicate QR's";
    res.json();
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
