const express = require('express')
const app = express()
const port = process.env.PORT || 8080
let testmsg = 'none'

interface response1 { 
  data: { 
    message: {
      list: [station]
    }
  }
}

interface station {
  brand: string;
  id: string; 
  name: string; 
  prices: {[key: string]: price}
}
interface price { 
  amount: number;
  id: string;
  type: string;
  stationId: string;
  updated: number;
}

const axios = require('axios').default;
// GET request for remote image in node.js
axios({
  method: 'get',
  url: 'https://petrolspy.com.au/webservice-1/station/box?neLat=-37.84387305170235&neLng=144.73792313126182&swLat=-37.93224483563403&swLng=144.65597198990326&ts=1657422060776&_=1657422059159',
})
  .then(function (response: response1) {
    console.log(response)
    const stations = response.data.message.list
    stations.forEach( station => {
      console.log( `Station ${station.brand} and ${station.name}`)
      testmsg = station.name
    })

  });


app.get('/', (req: any, res: { send: (arg0: string) => void }) => {
  res.send(testmsg)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})