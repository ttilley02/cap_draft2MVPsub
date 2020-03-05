'use strict';

//Global Variable to how response outputs
let activityStorage= [
{activity:"Sailing",
apparentTemperatureLow:0,
probabilityOfPrecipitation:100,
windSpeed:15,
waveHeight:7,
visibility:1852,
describe:"Sailing is ...",
html:
`
<div> Sailing </div>
<img class="pic">image placeholder</img>
<div>description placeholder</div>
<p>Here are some resources</p>
<ul>
  <li src=>link1</li>
  <li src=>link2</li>
<ul>
`,
photo:"placeholder",
links:"placeholderForLinks"

},
{
activity:"Hiking",
apparentTemperatureLow:0,
probabilityOfPrecipitation:100,
windSpeed:100,
waveHeight:100,
visibility:0,
describe:"Hiking is ...",
html: 
`
<div> Hiking </div>
<img class="pic">image placeholder</img>
<div>description placeholder</div>
<p>Here are some resources</p>
<ul>
  <li src=>link1</li>
  <li src=>link2</li>
<ul>
`,
photo:"placeholder",
links:"placeholderForLinks"
}
];

let doableActivities=[];

//Test against weather properties
function canIDoIt(tempNum,precipNum,windNum,waveNum,sightNum){
  let newArray = [];
  let qualifiedArray = [];

  for(let i = 0 ; i < activityStorage.length; i++)
  {
    if(tempNum >= activityStorage[i].apparentTemperatureLow && precipNum <= activityStorage[i].probabilityOfPrecipitation && windNum <= activityStorage[i].windSpeed && waveNum <= activityStorage[i].waveHeight && sightNum > activityStorage[i].visibility)
    {
      newArray.push(activityStorage[i].activity);
      qualifiedArray.push(activityStorage[i]);
      
    }
  }
  
  
  suggestedActivities(newArray,qualifiedArray);
}
//console.log(weatherForecast);

//Updates Dom with confirmation of being able to do something
function displayResults(responseJson) {
       $('.js-results').html('');
       $(responseJson).ready(function () {
       $('.loading').addClass('hidden');
       
      
    })
    let apTemp = Math.round((responseJson.properties.apparentTemperature.values[0].value * 1.8) + 32) ;
    let precip = responseJson.properties.probabilityOfPrecipitation.values[0].value;
    let wind = Math.round(responseJson.properties.windSpeed.values[0].value);
    let wave = Math.round(responseJson.properties.waveHeight.values[0].value);
    let sight = Math.round(responseJson.properties.visibility.values[0].value);
    
    let activitiesList = canIDoIt(apTemp,precip,wind,wave,sight);
    doableActivities = canIDoIt(apTemp,precip,wind,wave,sight);
    
    
    //send information to forecast page
    forecast(apTemp,precip,wind,wave,sight);
    console.log(activitiesList)
    

    
    
    
    $('.js-results').removeClass('hidden')

}

function forecast(apTemp,precip,wind,wave,sight){
 let forecastHtml = `<h1>Forecast</h1>
 <p>Temperature: ${apTemp} F°
 <br>Precipitation Chance: ${precip}%
 <br>Wind Speed: ${wind} Mph
 <br>Wave Height: ${wave}m
 <br>Visibiility: ${sight}m</p>
 <input type="button" class="activites" value="Suggested Activites">`
 
 $('.forecast').on('click', e => {
     console.log('forecast click')
     $('.container').html(forecastHtml)
 })
}

function suggestedActivities(doableStuff,qualifiedArray){
let qualifiedActivities = 
`
<h1>Look at what you can do</h1>
<section class= "activitiesList">

<ul class="js-suggested">
</section>
`

 $('.container').on('click', '.activites', e => {
     console.log('suggestedActivities click')
     $('.container').html(qualifiedActivities)

    
     for(let i = 0; i < doableStuff.length; i++){
    $(".js-suggested").append(
      `<li>  ${doableStuff[i]}
      <input class="${doableStuff[i]}" type="button" value="details">
      </li>
      `
      )
    }
    console.log(qualifiedArray.length);  
    for(let i = 0; i < qualifiedArray.length; i++){
      $('.activitiesList').append(qualifiedArray[i].html)
      }  

 })
}


function activitylisted(){
 $('ul').on('click','li', e => {
     console.log('sailing click')
     
 })
}



/*function active(activitiesList){

    for(let i = 0 ; i < activitiesList.length; i++){
      console.log(activityStorage[j].activity)
      
    wikiSearch(activitiesList[i])
    $('.js-results').append(
      `<div class="test"> ${activitiesList[i]} is possible!!! </div> 
      <br>
      <br>`)
    
    }
}


//    MediaWiki API 

function wikiSearch(searchterm){
var url = "https://en.wikipedia.org/w/api.php"; 

var params = {
    action: "opensearch",
    search: searchterm,
    limit: "1",
    namespace: "0",
    format: "json"
};

url = url + "?origin=*";
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

fetch(url)
    .then(function(response){return response.json();})
    .then(function(response) {
      $('.js-results').append(`<a href=${response[3]} class = "js-wiki"> ${response[3]}</a>`)
      })
    .catch(function(error){console.log(error);});
        
         
           
        

}*/


//Uses the user input of thier coordinates to find the weather grid area to report on.
function getWeather(coords) {
    const url = `https://api.weather.gov/points/${coords}/`
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => getGridData(responseJson.properties.forecastGridData))
        .catch(err => {
            displayError(err.message);
        });
         
} 

//Gets actual weather properties to examine
function getGridData(newURL) {
    const url = newURL;
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        
        //let latt = user.latitude; let long = user.longitude; let lat = parseFloat(latt.toFixed(6)); let lon = parseFloat(long.toFixed(6));
        .then(responseJson => 
         
         displayResults(responseJson)
        )
        .catch(err => {
            displayError(err.message);
        });
        
}


//HTML for error scenario
function displayError(error) {
    console.log('displayError ran');
    $('.js-results').html(`<h3 class="error">Something went wrong: ${error}</h3>`)
    $('.loading').addClass('hidden');
    $('.js-results').removeClass('hidden')
}



//relays position object
function success(geoLocationPos){
  let user = geoLocationPos.coords;

  console.log('Coordinates Sent');
  relayPosition(user)
};

//calls navigator and runs sucess function
function getPos(){
 $('.click').on('click', e =>{
  console.log('click')
  window.navigator.geolocation.getCurrentPosition(success)
  })
};
//sets coordinates to varibale
function relayPosition(user){

    let latt = user.latitude
    let long = user.longitude
    console.log(latt,long)

    //the rest of the code in this function and display position isnt needed
    let coords = latt + "," + long;

    getWeather(coords)
};

function displayPosition(string){
  $('.location').empty();
  $('.location').append(string);

}

getPos();
activitylisted();
