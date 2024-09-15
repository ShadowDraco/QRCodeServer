require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const PORT = process.env.PORT

const QRRouter = require('./routes/qr')

app.get('/', (req, res) => {
  res.send('')
})

app.use('/qr', QRRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
