const express = require('express')
const router = express.Router()
var QRCode = require('qrcode')

const AllQRCodes = []

router.get('/all', (req, res) => {
  res.json(AllQRCodes)
})

router.get('/visit/:url', (req, res) => {
  let visitUrl = req.params.url
  let QR = AllQRCodes.find(QR => QR.url == visitUrl)
  console.log(visitUrl, QR, AllQRCodes)
  if (QR) {
    QR.count += 1
    res.redirect(`https://${QR.url}`)
  } else {
    res.json({ message: 'This redirect does not exist.', error: '' })
  }
})

router.post('/create', async (req, res) => {
  const createUrl = req.body.url

  if (!req.body) {
    res.json({ message: 'Something is wrong' })
  }

  let returnData = { message: '', QR: '', error: '' }
  // if duplicate url
  if (AllQRCodes.find(QR => QR.url == createUrl)) {
    returnData.message = "You cannot create duplicate QR's"
    res.json(returnData)
  }
  // create qr
  try {
    QRCode.toDataURL(
      `${process.env.URL}/qr/visit/${createUrl}`,
      function (err, url) {
        newQR = { qr: url, url: createUrl, count: 0 }
        AllQRCodes.push(newQR)
        returnData.QR = newQR
        returnData.message = 'Successful!'
        res.json(returnData)
      }
    )
  } catch (err) {
    console.error(err)
    returnData.error = err
    res.json(returnData)
  }
})

module.exports = router
