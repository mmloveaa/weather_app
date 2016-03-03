$(document).ready(init);

var city, weatherdescription, humidity, weathericon, temp, cities;

// console.log(typeof input)

function init(){
  event.preventDefault;
  loadFromLocalStorage();
  var input = $('#input').val(); 

  $("#getforecast").click(getCurrentWeather);
  populateCityList();
  $('#currentWeather').on("click", ".removeforecast", removeCard);
  $('#currentWeather').on("click", "")
}
  // self is the button when ('#currentWeather') is clicked
  // populateCityList();

  // $('.removeforecast').on("click", removeCard);
  // self is the card when (.removeforecast is clicked)

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

function saveCityData(data){

  var cityData = {};
  cityData.weatherdescription = data.weather[0].description;
  cityData.weathericon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  cityData.humidity = data.main.humidity;
  cityData.temp = data.main.temp;
  cityData.tempmax = data.main.temp_max
  cityData.tempmin = data.main.temp_min
  cityData.name = data.name;
  // everytime we enter a new city, it store as an object in the cities array , when we save to localStorage, we have to change it to string to save it
  cities.push(cityData);
  localStorage.cities = JSON.stringify(cities);
  // localStorage.cityData = JSON.stringify(cityData);
  // console.log(data.main);
  showCityData(cityData);
}

//   // http://openweathermap.org/img/w/04n.png <<w orks
//   // dateTime = moment(data.current_observation.local_time_rfc822).format('MMMM Do YYYY,   h:mma');



function populateCityList() {
  cities.forEach(showCityData);
}

function showCityData(cityData) {
  console.log("show city:", cityData);
  //parse cityData from localStorage, make it into objects
  // console.log(cityData);

    // console.log(data);
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
    console.log('card ', $card.data())

    
    // // $('.humidity').text(cityData.humidity);
    // //set values of temp, tempmax, etc from cityData
    $('#currentWeather').append($card);

    return $card;
}


function removeCard(event) {
  var self = this;
  // console.log('localstorage ', localStorage.cities)

  var rcCities = JSON.parse(localStorage.cities)
  // console.log('rcCities ', rcCities)

  rcCities.forEach(function(city, index){
    var temp = $(self).closest(".card").data().cityname
    if (temp === city.name) {
      rcCities.splice(index, 1)
      // console.log('this is the city we are trying to match', temp, typeof temp)
      // console.log('this is all the cities ', city.name, typeof city.name)
      // console.log('are they the same ', temp === city.name)
      // console.log('splicing something out ', rcCities.length)
    }

  })

  cities = rcCities;
  localStorage.cities = JSON.stringify(rcCities);
  $(this).closest(".card").remove();

}
  // var test = localStorage.getItem($(this).data().cityname)
  // console.log('test ', test)
  // console.log('which card was clicked ', $(this).data())

function convertToF(temp){
  return ((Number(temp)-273)*(9/5)+32).toFixed(2).toString();

}

function viewDetail(){

}

// function convertToC(temp) {
//   return (Number(temp) - 273).toFixed(2).toString();
// }