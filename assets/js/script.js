//variables to store a reference to the <form> element using each id
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#cityname");
//variables to reference DOM elements
var currentWeatherContainer = document.querySelector('#weatherCurrent');
var forecastContainer = document.querySelector('#forecast-container');
var searchHistory = document.querySelector('#searchHistory');


//get user Weather function
var getUserWeather = async function (city) {
    var calcWeather = async (weatherResponse) => {
        var displayWeather = async function (data) {
            //get city coordinates from returend object
            var coordLat = data.coord.lat;
            var coordLon = data.coord.lon;
            console.log(coordLat, coordLon);

            //return fetch request to the one call api with the coordinates 
            var forecast = await fetch(
                'https://api.openweathermap.org/data/2.5/onecall?lat=' + coordLat + '&lon=' + coordLon + '&units=imperial&exclude=current, minutely,hourly, alerts&appid=0709fe582a3226805c5caaebd2b415a5'
            );
            var forecastJSON = await forecast.json();
            console.dir(forecastJSON.daily[0].uvi)
            displayCurrentWeather(data, forecastJSON.daily[0].uvi);
            displayForecast(forecastJSON);
        }

        var weatherResponseJSON = await weatherResponse.json();
        displayWeather(weatherResponseJSON);
    }
    //format the weather api url
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=0709fe582a3226805c5caaebd2b415a5'

    //make a request to the url concatenating 'city' value
    var weatherResponse = await fetch(apiUrl)
    calcWeather(weatherResponse);


}


//Function to obtain city input on button click
var formSubmitHandler = function (event) {
    event.preventDefault();
    // get value from input element
    var city = cityInputEl.value.trim();
    console.log(city);
    //check if cityname was entered
    if (city) {
        //if yes, pass cityname into getUserWeather()
        getUserWeather(city);
        createHistory(city);
        //clear value from the <input> element
        cityInputEl.value = "";
    } else {
        alert("Please enter a City name");
    }

    console.log(event);
};

//add city to search history
var createHistory = function (city) {

    //create an array of user entered cities to be stored as history
    var cityArray = JSON.parse(localStorage.getItem('cityHistory')) || [];
    cityArray.push(city);

    //save value of city array to localstorage
    localStorage.setItem('cityHistory', JSON.stringify(cityArray));

    console.log(cityArray);

    //retrieve array data from local storage and console.log
    var retrievedData = localStorage.getItem("cityHistory");
    var cityArray2 = JSON.parse(retrievedData);

    //create div for each city search/display from array
    var searchedCityEl = document.createElement('button');
    searchedCityEl.classList = "city-item btn btn-secondary btn-lg btn-block"
    searchedCityEl.textContent = city;
    searchedCityEl.onclick = () => getUserWeather(city);
    //append to searchHistory DOM
    searchHistory.appendChild(searchedCityEl);

}


//FUNCTION to display CURRENT WEATHER
var displayCurrentWeather = function (weather, uvi) {
    console.log(weather);

    // clear old content from container
    currentWeatherContainer.textContent = "";

    //format forecastDateUnix to regular date
    function convertTimestamp() {
        var unixTimestamp = weather.dt;
        dateObj = new Date(unixTimestamp * 1000);
        utcString = dateObj.toUTCString();
        currentDate = dateObj.toLocaleDateString();

    }
    convertTimestamp();

    //format weather info
    var cityInfo = weather.name + '(' + currentDate + ')';
    console.log(cityInfo);

    //format today's weather info
    var tempInfo = weather.main.temp;
    var windInfo = weather.wind.speed;
    var humInfo = weather.main.humidity;

    //UV info here

    //create container for current weather
    var currentWeatherEl = document.createElement("div");
    currentWeatherEl.classList = "list-item flex-row justify-space-between align-center";

    //create container for current city and date
    var currentCityEl = document.createElement("div");
    currentCityEl.classList = 'card-title font-weight-bold';
    currentCityEl.textContent = cityInfo;

    //append to currentWeatherContainer DOM
    currentWeatherContainer.appendChild(currentCityEl);

    //create icon element
    var weatherIconEl = document.createElement("img");
    //get icon code
    var weatherIconCode = weather.weather[0].icon;
    //insert icon to image element
    weatherIconEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + weatherIconCode + '@2x.png');
    //append to currentWeatherContainer DOM
    currentWeatherContainer.appendChild(weatherIconEl);

    //create container for today's weather info
    var todaysWeatherInfoEl = document.createElement("div");
    todaysWeatherInfoEl.textContent = 'Temp: ' + tempInfo + ' ' + 'Wind: ' + windInfo + ' ' + 'Humidity: ' + humInfo + ' ' + 'UV: ' + uvi;


    //append to currentWeatherContainer DOM
    currentWeatherContainer.appendChild(todaysWeatherInfoEl);
}
//FUNCTION to display forecast weather
var displayForecast = function (forecastArr) {

    //clear old content
    forecastContainer.textContent = "";

    //loop over forecast days max 5
    for (var i = 1; i < 6; i++) {
        //create variable to hold temp,wind,humidity, date
        var forecastTemp = "Temp: " + forecastArr.daily[i].temp.day;
        var forecastWind = "Wind: " + forecastArr.daily[i].wind_speed;
        var forecastHum = "Humidity: " + forecastArr.daily[i].humidity;
        //format forecastDateUnix to regular date
        function convertTimestamp() {
            var unixTimestamp = forecastArr.daily[i].dt;
            dateObj = new Date(unixTimestamp * 1000);
            utcString = dateObj.toUTCString();
            forecastDate = dateObj.toLocaleDateString();
        }
        convertTimestamp();

        // //create a container for each forecast day
        var forecastEl = document.createElement("div");
        forecastEl.classList = "flex-row justify-space-between align-center";

        // //create a span element for date
        var dateEl = document.createElement("span");
        dateEl.textContent = forecastDate;

        // //append to container
        forecastEl.appendChild(dateEl);

        //create icon element
        var iconEl = document.createElement("img");
        //get icon code
        var iconCode = forecastArr.daily[i].weather[0].icon;
        //insert icon to image element
        iconEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png');

        //append to container
        forecastEl.appendChild(iconEl);

        //create div element for weather details
        var forecastInfoEl = document.createElement("div");
        forecastInfoEl.textContent = forecastTemp + ' ' + forecastWind + ' ' + forecastHum;

        //append forecastInfoEl to forecastEl container
        forecastEl.appendChild(forecastInfoEl);

        //append forecastEl to forecastContainer
        forecastContainer.appendChild(forecastEl);
    }
}

// submit event listener - when user clicks Get City formSubmitHandler is activated
userFormEl.addEventListener("submit", formSubmitHandler);

