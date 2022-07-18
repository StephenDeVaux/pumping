const fetch = require('node-fetch')
const axios = require('axios').default;

let station_list = {
  '623ab42db991422b2f72a30e' : "88 Derrimut Road ", 
  '5212f92f0364bb212f028d74' : "1-15 Old Geelong Road & Heaths Road ", 
  '5212f92f0364bb212f028d40' : "380 Morris Road ", 
  "5212f92f0364bb212f028d1f" : "Cnr. Synnot & Bridge Streets ",
  "5212f92f0364bb212f028d8f" : "370 Heaths Road & Tarneit Road ",
  "5212f92f0364bb212f028e94" : "618 Tarneit Road ",
  "5f3cdd8eb9914218b4bac5a7" : "32 Escapade Street",
  "5212f92f0364bb212f028d8e" : "180 Duncans Road & Edwards Road ",
  "5212f92f0364bb212f028d53" : "Cnr. Boardwalk Blvd. & Tom Roberts Parade ",
  "58339288e4b02b1af00ce701" : "1/475 Leakes Rd",
}

interface response { 
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
  type: string; // U91 or U95,
  updated: number; //last updated time,
}

interface station_details { 
  id: string, 
  updated: number, 
  type: string, 
  amount: number,
  name: string
}

const get_fuel_prices = () => axios({
  method: 'get',
  url: 'https://petrolspy.com.au/webservice-1/station/box?neLat=-37.830565334314564&neLng=144.7729921176513&swLat=-37.91895307811704&swLng=144.6504430606434&ts=1657740114167&_=1657740113506',
})
  .then(function (response: response) {
    let my_station_list: [station_details?] = []
    const stations = response.data.message.list

    for (const station of stations) { 
      if ( (station.id in station_list) && "U91" in station.prices) {
        my_station_list.push({
          id: station.id,
          updated: station.prices["U91"].updated,
          type: station.prices["U91"].type,
          amount: station.prices["U91"].amount,
          name: station.name
        })
      }
    }

    sendTelegramMsg(create_msg(my_station_list))
  });


const sendTelegramMsg = (msg: string | number | boolean) => {
  fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOTID}/sendMessage?chat_id=${process.env.TELEGRAM_CHATID}&text=${encodeURIComponent(msg)}`)
  .then((res: { ok: any; status: number }) => {
    if (res.ok) { // res.status >= 200 && res.status < 300
      console.log('Telegram msg sent')
    } else if (res.status == 403) { 
      // User has paused/stopped bot. Do nothing
      console.log('Telegram msg - User has paused/stopped the bot')
    } else {
      console.log('Telegram msg - Its be borkens....')
      console.log(res)
    }
  })
}

const create_msg = (stations:[station_details?]) => { 
  // \n to create new line
  let msg = 'Todays petrol prices are: \n'
  // @ts-ignore
  stations.sort(function(a, b){return a.amount - b.amount}) 

  for (const station of stations) { 
    // @ts-ignore
    msg += `- ${station?.amount} - ${station?.name} - ${station_list[station.id]}  \n`
  }
  return msg
}

get_fuel_prices()

module.exports = get_fuel_prices