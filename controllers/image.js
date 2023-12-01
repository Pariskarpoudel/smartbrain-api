const Clarifai = require('clarifai')
const { response } = require('express')

// clarifai api is only needed in this route
const SetupClarifai = (imageurl) => {
    const PAT = process.env.API_KEY
    const USER_ID = 'lfhuehuixil0'
    const APP_ID = 'my-first-application-6auc6'
    const MODEL_ID = 'face-detection'
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105'
    const IMAGE_URL = imageurl
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
    });
  
    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
    };
    return requestOptions
  }

  // clarifai api lai backend ma lani, coz image detect garda clarifai ma jun request pathainxa frontendma, network ma herda teha request headers ko roopma authorization key vanera pat key dekhido raixa which may be risky in case of paid apis, so move it to backend
  // clarifai api ma call or request pathauni in our backend code, tesko response ta hamlai yeha front end mai chainxa
  // clarifai is meant to  be used on backend
  // so aba detect garda network maa, aile clarifai call ta imageurl request ma vaxa ni, tara network tabma sidhai tyo dekhinnna, coz backend vitra k garim network lai thaxaina
  // frontend bata k request pathaim server haruma tei dekhauniho, so paila ta clarifai frontendma huda request headerse ma api key dekkhethyo , aile dekkhena , clarifai request jo dekkhexaina, imageurl ma request matra dekkhexa
  // imageurl endpoint ko request  matra dekhiyo , ani imageurl ko response dekhiyo, clarifai api call wala kei ni dekkhena, so api key pani safe vayo

const handleApiCall = (req,res) => {
   
    // fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs",SetupClarifai(this.state.imageurl)) 
    // so imageurl req ko body mai pathauniiii , ani yeha grab garni
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs",SetupClarifai(req.body.input)) 
    .then(response => response.json())
    .then(data=>{
        
        res.json(data)})
    .catch(err=> res.status(400).json('Unable to work with API'))
}

const handleImage = (req,res,postgres)=>{
    // /image path ma put request auda bitikai tyo userko entries ek le badhni vayo, sathma userko id pathauni
    // yo userle kati ota image submit garexata, id chaiyo , url ma navaera request body ma id dinxam yeha chai 
    const {id} = req.body;
    // update() use garda, entries + 1 ho, so paila grab current entries  by select, then only update by doing entries + 1, so duita sql command use garna paryo, yovanda ramro use increment command in knex js, use select to grab records
   postgres('users')
  .where('id', '=', id)
  .increment('entries', 1)
  // yettile ni execute garxa, db update hunxa,returns a promise which wont be used and end all sorted , butt we wantt current entriess of this updated user to show in the frontend, so returning use garni to get the current entries
  .returning('entries')  // jun record/row update garim, tei record matra return hunasakxa as response, * returns all columns, 'entries' returns only value of entries column, ['id','entrires'] ni painthyo
  .then((entries)=>{
    // console.log(entries)  [ { entries: '1' } ]  
    // res.json(Number(entries[0].entries)) 
    res.json(entries[0].entries)
})
  .catch(err=> res.status(400).json('Unable to get entries.'))
}

module.exports = {handleApiCall: handleApiCall, handleImage: handleImage}