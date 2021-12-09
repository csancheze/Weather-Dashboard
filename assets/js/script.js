var searchform = document.getElementById("city-input")
var cityInput = document.getElementById("city")
var historyContainer = document.getElementById("history")
var todayWeather = document.getElementById("today-weather")
var weatherCards = document.getElementById/("weather-cards")
var city;
var historyArray = ["empty","empty","empty","empty","empty","empty","empty","empty","empty","empty"]
let i= 0
var currentLocation = "none";
var currentLatitude;
var currentLongitude;


//getting current location
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      alert("Location is not supported by this browser.");
    }
  }
  
  function showPosition(position) {
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    getCurrentCity()
  }

function getCurrentCity() {
var geoLocationApi = "http://api.positionstack.com/v1/reverse?access_key=6c580d91db50a4e22cec5e385b8b595a&query="+currentLatitude+","+currentLongitude

fetch(geoLocationApi)
    .then(function (response) {
        console.log(response)
        if(response.ok) {
            response.json()
            .then(function(data){
                console.log(data)
                city = data.data[0].locality
                console.log(city)
                getCityLatLong()
            })
        }else {
            alert("Locality could not be retrieved")
        }
    })
}

//getting the weather

var weatherHandler = function (event) {
    event.preventDefault();

    city = cityInput.value.trim()
    if (!city) {
        alert("Please enter a city name. For example: London")
        return
    }
    getCityLatLong();
}

function getCityLatLong() {
    var weatherApi = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid=724b3d28609abb931270460752653a80"
    fetch(weatherApi)
        .then(function (response) {
            console.log(response)
            if(response.ok) {
                response.json()
                .then(function(data){
                    console.log(data)
                    var searchLatitude = data[0].lat
                    var searchLongitude = data[0].lon
                    console.log(searchLatitude,searchLongitude)
                    makeHistory() 
                    getWeather(searchLatitude,searchLongitude)

                })
            }else {
                alert("Locality not found. Try another or check spelling.")
            }
        })
}

function getWeather(lat,long) {
    var weatherApi = "http://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude={part}&units=metric&appid=724b3d28609abb931270460752653a80"
    fetch(weatherApi)
        .then(function (response) {
            console.log(response)
            if(response.ok) {
                response.json()
                .then(function(data){
                    console.log(data)
                    var todayWeather = data.current
                    var nextFiveDays = data.daily.splice(1,5)
                    console.log (todayWeather)
                    console.log(nextFiveDays)
                    renderCurrentWeather(todayWeather)
                    renderNextWeather(nextFiveDays)
                })
            }else {
                alert("Weather data not found.")
            }
        })
}

function renderCurrentWeather(today) {
    todayWeather.innerHTML=""
    var currentCity= city +" "+ moment().format("DD/MM/YY")
    var cityDateEl = document.createElement("p")
    cityDateEl.textContent = currentCity
    var currentTemp = document.createElement("p")
    currentTemp.textContent = "Temperature: "+today.temp +"°C"
    var currentWind = document.createElement("p")
    currentWind.textContent= "Wind: "+today.wind_speed +" m/s"
    var currentHumidity = document.createElement("p")
    currentHumidity.textContent= "Humidity: "+today.humidity + "%"
    var currentUV=document.createElement("p")
    currentUV.textContent="UV: "+today.uvi
    if (today.uvi < 3) {
        currentUV.classList ="bg-sucess"
    } else if (today.uvi < 8) {
        currentUV.classList ="bg-warning"
    } else currentUV.classList ="bg-danger"
    todayWeather.append(cityDateEl,currentTemp,currentWind,currentHumidity,currentUV)

    
     


}

function renderNextWeather(nextFive) {
    var oneDay = moment().add(1,"days").format("DD/MM/YY")
}





//history
function makeHistory() {
    var historyArrayOld = localStorage.getItem("history")
    if (!historyArrayOld) {
        historyArray = historyArray
    } else {
        historyArray = (JSON.parse(historyArrayOld))
    }
    console.log(historyArray)
    var historyIndex = parseInt(localStorage.getItem("index")) || 0
    console.log(historyIndex)
    if (!historyArray.includes(city)) {
        historyArray[historyIndex] = city
        historyIndex +=1  
    }
    if (historyIndex == 10) {
        historyIndex = 0
    }
    localStorage.setItem("lastcity",city)
    localStorage.setItem("index", historyIndex)
    localStorage.setItem("history", JSON.stringify(historyArray))
    renderHistory();
}

function renderHistory() {
    historyContainer.innerHTML=""
    console.log(historyArray)
    for (let i=0; i < historyArray.length ; i++) {
        if (historyArray[i] != "empty") {
            var historyButton = document.createElement("button")
            historyButton.textContent = historyArray[i]
            historyButton.addEventListener("click",function(event){
                event.preventDefault();
                city = event.target.textContent
                getCityLatLong()
            }
            )
            historyContainer.append(historyButton)
        }
        
    }
}

searchform.addEventListener("submit",weatherHandler)

//init

function init () {
    getLocation()    
   
}

init();

