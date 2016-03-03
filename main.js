$(document).ready(init);

var city, weatherdescription, humidity, weathericon, temp, cities;

function init(){
  event.preventDefault;
  loadFromLocalStorage();
  var input = $('#input').val(); 

  $("#getforecast").click(getCurrentWeather);
  populateCityList();
  $('#currentWeather').on("click", ".removeforecast", removeCard);
  $('#currentWeather').on("click", ".viewDetails", getNextDaysForecast);
}

function loadFromLocalStorage() {
  if(!localStorage.cities) {
    cities = [];
  } else {
    cities = JSON.parse(localStorage.cities);
  }
}


function getCurrentWeather(event){
  event.preventDefault();
  // $('#currentWeather').empty()
  city = $("#input").val();
      $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=5a720bb7f76e1bcd2383f4e8c3e196a7&unit",
        type: "GET",
        success: function(data){
          console.log(data);
          saveCityData(data);
          $('#input').val('')
        },
        error: function(err){
          console.error(err);
        }
      });
}

function getNextDaysForecast(event){
    event.preventDefault();
    // console.log("get next day is working!")
    city = $(this).closest(".card").find(".cityname").text();   
    // console.log("city", city);
      $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=5a720bb7f76e1bcd2383f4e8c3e196a7&unit",
        type: "GET",
        success: function(data){
          // console.log("next day's forecast", data);
          saveNextDaysDetails(data);
          displayThreeDaysInfo(data);
          $('#input').val('')
        },
        error: function(err){
          console.error(err);
        }
      });
}

function saveCityData(data){

  var cityData = {};
  cityData.weatherdescription = data.weather[0].description;
  cityData.weathericon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  cityData.humidity = data.main.humidity;
  cityData.temp = data.main.temp;
  cityData.tempmax = data.main.temp_max
  cityData.tempmin = data.main.temp_min
  cityData.name = data.name;
  cities.push(cityData);
  localStorage.cities = JSON.stringify(cities);
  makeWeatherCard(cityData);
}

function saveNextDaysDetails(data){
  var city_Data = {};
  city_Data.tempmax = data.list[0].main.temp_max;
  city_Data.tempmin = data.list[0].main.temp_min;
  city_Data.name = data.city.name;
}

function displayThreeDaysInfo(data) {
  var arrayDaysTime = [];
  var arrayDaysTemp = [];
  var arrayOfIcons = [];

  $("#showforecast").removeClass("hidden");

  for(var i=0; i<data.list.length; i++){
    if(data.list[i].dt_txt.slice(-8) === "12:00:00"){
      // i += 7;
      var time = data.list[i].dt_txt
      var temp = data.list[i].main.temp
      var icon = `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
      arrayDaysTime.push(time);
      arrayDaysTemp.push(temp);
      arrayOfIcons.push(icon);
    }
  }  


   var arrayDateOnly = []; 
    for (var i=0; i < arrayDaysTime.length; i++){
      var dateOnly = arrayDaysTime[i].slice(0,11)
      arrayDateOnly.push(dateOnly)
    }

  showDate(arrayDateOnly);
  showTemp(arrayDaysTemp);
  addForecastImg(arrayOfIcons);

}
// http://openweathermap.org/img/w/04n.png <<w orks
// dateTime = moment(data.current_observation.local_time_rfc822).format('MMMM Do YYYY,   h:mma');

function populateCityList() {
  cities.forEach(makeWeatherCard);
}

function makeWeatherCard(cityData) {
  // parse cityData from localStorage, make it into objects
    var $card = $('#weatherTemplate').clone();
    $card.removeAttr('id');

    $card.find('.temp').text(convertToF(cityData.temp)+"F");
    $card.find('.tempmax').text(convertToF(cityData.tempmax)+"F");
    $card.find('.tempmin').text(convertToF(cityData.tempmin)+"F");
    $card.find('.cityname').text(cityData.name).css('float','right');
    $card.find('.weatherdescription').text(cityData.weatherdescription);
    $card.find('.weathericon').attr('src', cityData.weathericon);
    $card.find('.humidity').text(cityData.humidity+"%");
    // add class which has the style for each card, and hide the template
    $card.addClass("card");

    // ADD A DATA ATTRIBUTE TO EACH CARD THAT IDENTIFIES WHAT CITY IT IS
    $card.data('cityname', cityData.name)

    $('#currentWeather').append($card);
    return $card;
}


function removeCard(event) {
  var self = this;
  var rcCities = JSON.parse(localStorage.cities)

  rcCities.forEach(function(city, index){
    var temp = $(self).closest(".card").data().cityname
    if (temp === city.name) {
      rcCities.splice(index, 1)
    }
  })

  cities = rcCities;
  localStorage.cities = JSON.stringify(rcCities);
  $(this).closest(".card").remove();

}

function convertToF(temp){
  return ((Number(temp)-273)*(9/5)+32).toFixed(2).toString();
}

function showDate(arrayDateOnly) {
  for(var i = 0; i < 3; i++){
    var $day = $(`.day${i+1}`);
    $day.text("Date: ");
    $day.append(arrayDateOnly[i])
  }
}

function showTemp(arrayDaysTemp) {
  for(var i = 0; i < 3; i++){
    var $temp = $(`.temp${i+1}`);
    $temp.text("Temp: ");
    $temp.append(convertToF(arrayDaysTemp[i])+"F")
  }
}

function addForecastImg(arrayOfIcons){
  // console.log("New Array of Icons: ", arrayOfIcons)
    for(var i = 0; i < 3; i++){
      var $icon = $(`.image${i+1}`);
      // console.log("icon: ", arrayOfIcons[i])
      $icon.attr('src', arrayOfIcons[i])
    }
}

// function convertToC(temp) {
//   return (Number(temp) - 273).toFixed(2).toString();
// }