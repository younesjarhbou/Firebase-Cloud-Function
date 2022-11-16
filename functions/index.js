const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const database = admin.database();
const fetch = require('node-fetch');
const { Console } = require("console");
    
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'change it with your rapid api key',
    'X-RapidAPI-Host': 'change it with your rapid api host key'
  }
};


/**
 * It returns the current date in the format YYYY-MM-DD
 * @returns The current date in YYYY-MM-DD format.
 */
 function get_date()
 {
     let date_ob = new Date();
     // current date
     // adjust 0 before single digit date
     let date = ("0" + date_ob.getDate()).slice(-2);
 
     // current month
     let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
 
     // current year
     let year = date_ob.getFullYear();
 
     // current hours
     let hours = date_ob.getHours();
 
     // current minutes
     let minutes = date_ob.getMinutes();
 
     // current seconds
     let seconds = date_ob.getSeconds();
 
     // prints date in YYYY-MM-DD format
     return(year + "-" + month + "-" + date);
 
     // prints date & time in YYYY-MM-DD HH:MM:SS format
     //	console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
 
     //return (s);
 }
 
 /**
  * It takes a fixture id as an argument, makes a request to the API-Football API, and returns the
  * response as a JSON object
  * @param fixtureid - The ID of the fixture you want to get the prediction for.
  * @returns the json object that is returned from the API.
  */
 async function get_prediction(fixtureid) {
     const url = 'https://api-football-v1.p.rapidapi.com/v2/predictions/'+fixtureid;
     var objjson = "null";
 
     await fetch(url, options)
         .then((res) => res.json())
         .then((json) => {
             objjson = json;
             database.ref("static_data2").child("prediction").child(get_date()).child(fixtureid).set(json.api.predictions[0]);
             console.log("jarhbou"+json);
         })
         .catch((err) => console.error('error:' + err));
     return objjson;
 }
 
 /**
  * It fetches the data from the API and stores it in the database
  * @param fixtureid - The ID of the fixture you want to get the details for.
  */
 async function get_fixturedetail(fixtureid)
 {
     const fetch = require('node-fetch');
 
     const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures/events?fixture=215662';
 
     fetch(url, options)
         .then(res => res.json())
         .then((json) => {
             for (var i = 0; i < arr.length; i++){
   document.write("<br><br>array index: " + i);
   var obj = arr[i];
   for (var key in obj){
     var value = obj[key];
     document.write("<br> - " + key + ": " + value);
   }
 }
             database.ref("static_data2").child("fixture_detail").child(get_date()).child(fixtureid).set(json.response);
             console.log("fixture"+json);
         })
         .catch(err => console.error('error:' + err));
 }
 
 /**
  * It fetches the data from the API and stores it in the database
  */
 async function get_fixture() {
     const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?date='+get_date()+'&timezone=Europe%2FLondon';
     
     await fetch(url, options)
         .then((res) => res.json())
         .then((json) => {
             console.log("looplenth"+json.response.length);
             json.response.forEach(element => {
                // console.log("fixture"+element.fixture.id);
                 
                 //get_fixturedetail(element.fixture.id);
             });
             database.ref("static_data2").child("fixture").child(get_date()).set(json.response);
             console.log("fixture"+json);
         })
         .catch((err) => console.error('error:' + err));
 }
 
 /**
  * It fetches the data from the API, then it converts the response to JSON, then it stores the data in
  * the database
  */
 async function get_leauge() {
     
 
     
     return fetch(url, options)
         .then((res) => res.json())
         .then((json) => {
             database.ref("static_data2").child("league").set(json.api.leagues);
             //console.log("jarhbou"+json);
         })
         .catch((err) => console.error('error:' + err));
 }
 
 /**
  * It fetches the timezone from the API and stores it in the database
  */
 async function get_timezone() {
     
     const url = 'https://api-football-v1.p.rapidapi.com/v2/timezone';
     
     return fetch(url, options)
         .then((res) => res.json())
         .then((json) => {
             database.ref("static_data2").child("timezone").set(json.api.timezone);
             console.log("jarhbou"+json);
         })
         .catch((err) => console.error('error:' + err));
 }
 
 /* Listening to the database for any changes in the `scraped` node. */
 exports.explore_realtime = functions.database
     .ref("scraped/{current_day}/{anychild}/time")
     .onCreate((snapshot, context) =>{
       const name = snapshot.val();
       database.ref("metadata").set("test meta");
       console.log(name);
     });
 
 /* A function that is scheduled to run every 600 minutes. */
 exports.explore_realtime_schedule = functions.pubsub
     .schedule("every 600 minutes" ).timeZone()
     .onRun(( context) =>{
       const date = new Date();
       database.ref("metadata2").set(date.getTime());
       //get_fixture();
       //get_prediction("963246");
       get_timezone();
     });
 