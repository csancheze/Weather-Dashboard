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
  }



var weatherHandler = function (event) {
    event.preventDefault();

    city = cityInput.value.trim()
    if (!city) {
        alert("Please enter a city name")
        return
    }
    renderWeather();
    makeHistory();
}

function renderWeather() {
    i++
    console.log(i)
    console.log(city)   
}

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
                renderWeather()
            }
            )
            historyContainer.append(historyButton)
        }
        
    }
}

searchform.addEventListener("submit",weatherHandler)

function init () {
    city = currentLocation
    renderWeather()

    makeHistory()
}

init();

