const express = require('express')
const app = express()
const send_fuel_prices = require("./dailyCron")

const port = process.env.PORT || 8080
let testmsg = 'fuel prices sent'

app.get('/', (req: any, res: { send: (arg0: string) => void }) => {
  send_fuel_prices()
  res.send(testmsg)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})