require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const PORT = process.env.PORT

const QRRouter = require('./routes/qr')

app.get('/', (req, res) => {
  res.send('')
})

app.post('/lol', (req, res) => {
  console.log('BODY ', req.body)
  res.json(req.body)
})

app.use('/qr', QRRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
