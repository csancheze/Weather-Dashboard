var searchform = document.getElementById("city-input")
var cityInput = document.getElementById("city")
var historyContainer = document.getElementById("history")
var todayWeather = document.getElementById("today-weather")
var weatherCards = document.getElementById("weather-cards")
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
var geoLocationApi = "https://api.positionstack.com/v1/reverse?access_key=6c580d91db50a4e22cec5e385b8b595a&query="+currentLatitude+","+currentLongitude

fetch(geoLocationApi)
    .then(function (response) {
        if(response.ok) {
            response.json()
            .then(function(data){
                city = data.data[0].locality
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
    var weatherApi = "https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid=724b3d28609abb931270460752653a80"
    fetch(weatherApi)
        .then(function (response) {
            if(response.ok) {
                response.json()
                .then(function(data){
                    var searchLatitude = data[0].lat
                    var searchLongitude = data[0].lon
                    city=data[0].name
                    makeHistory() 
                    getWeather(searchLatitude,searchLongitude)

                })
            }else {
                alert("Locality not found. Try another or check spelling.")
            }
        })
}

function getWeather(lat,long) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude={part}&units=metric&appid=724b3d28609abb931270460752653a80"
    fetch(weatherApi)
        .then(function (response) {
            if(response.ok) {
                response.json()
                .then(function(data){
                    var todayWeather = data.current
                    var nextFiveDays = data.daily.splice(1,5)
                    renderCurrentWeather(todayWeather,)
                    renderNextWeather(nextFiveDays)
                })
            }else {
                alert("Weather data not found.")
            }
        })
}

//render weather info

function renderCurrentWeather(today) {
    todayWeather.innerHTML=""
    var cardTextDiv = document.createElement("div")
    var currentCity= city +" "+ moment().format("DD/MM/YY")
    var cityDateEl = document.createElement("h3")
    cityDateEl.classList = "card-header"
    cityDateEl.textContent = currentCity
    var currentTemp = document.createElement("p")
    currentTemp.classList = "card-text"
    currentTemp.textContent = "Temperature: "+today.temp +"°C"
    var currentWind = document.createElement("p")
    currentWind.classList = "card-text"
    currentWind.textContent= "Wind: "+today.wind_speed +" m/s"
    var currentHumidity = document.createElement("p")
    currentHumidity.classList = "card-text"
    currentHumidity.textContent= "Humidity: "+today.humidity + "%"
    var currentUV=document.createElement("p")
    currentUV.textContent="UV: "+today.uvi
    if (today.uvi < 3) {
        currentUV.classList ="bg-success"
    } else if (today.uvi < 8) {
        currentUV.classList ="bg-warning card-text"
    } else currentUV.classList ="bg-danger card-text"
    cardTextDiv.append(cityDateEl,currentTemp,currentWind,currentHumidity,currentUV)
    cardTextDiv.classList="card justify-content-between w-40"
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", "./assets/images/"+today.weather[0].icon+".png")
    weatherIcon.classList = "card-img main-img"
    todayWeather.append(weatherIcon,cardTextDiv)
}

function renderNextWeather(nextFive) {
    weatherCards.innerHTML=""
    for (let i=0; i < nextFive.length; i++) {
        var cardContainer = document.createElement("div")
        cardContainer.classList = "card col-8 col-md-2 mx-auto mb-1"
        cardContainer.setAttribute("style", "border-color:#31545B;border-width:4px")
        var cardIcon = document.createElement("img")
        cardIcon.setAttribute("src", "./assets/images/"+nextFive[i].weather[0].icon+".png")
        cardIcon.classList = "card-img-bottom img-fluid"
        var oneDay = moment().add(i+1,"days").format("DD/MM/YY")
        var dayDate = document.createElement("h3")
        dayDate.textContent=oneDay
        dayDate.classList = "card-header"
        var cardTemp = document.createElement("p")
        cardTemp.classList = "card-text"
        cardTemp.textContent = " Temperature min: "+ nextFive[i].temp.min +" / max: " + nextFive[i].temp.max
        var cardWind = document.createElement("p")
        cardWind.textContent= "Wind: "+ nextFive[i].wind_speed +" m/s"
        cardWind.classList = "card-text"
        var cardHumidity = document.createElement("p")
        cardHumidity.textContent =  "Humidity: "+nextFive[i].humidity + "%"
        cardHumidity.classList = "card-text"

        cardContainer.append(dayDate,cardIcon,cardTemp,cardWind,cardHumidity)
        weatherCards.append(cardContainer)

    }
}

//history
function makeHistory() {
    var historyArrayOld = localStorage.getItem("history")
    if (!historyArrayOld) {
        historyArray = historyArray
    } else {
        historyArray = (JSON.parse(historyArrayOld))
    }
    var historyIndex = parseInt(localStorage.getItem("index")) || 0
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
            historyButton.classList = "form-control m-1 btn btn-dark text-light history-button"
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

