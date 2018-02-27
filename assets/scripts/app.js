'use strict';

const KEY = 'f0fbcc49d7cc2b979f64448712abcbde';
const API_URL = 'http://api.openweathermap.org/data/2.5/forecast?q=nynashamn&APPID='+ KEY;

function HttpGet(url){
    this.url = url;
    this.ajax = new XMLHttpRequest();
}

HttpGet.prototype.proceed = function(callback){
    this.ajax.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200){
            callback(this.response);
        }        
    }
    this.ajax.open('Get', this.url, true);
    this.ajax.send();
}

function fetch(url){
    return new HttpGet(url);
}

function $(selector) {
    return document.querySelector(selector);
}

function DOMElement(selector) {
    this.element = $(selector);
}

DOMElement.prototype.select = function(target){
 this.selected = $(target);
 return this;
}

DOMElement.prototype.click = function(callback) {
    this.element.addEventListener('click', event => {
        event.selected = this.selected;
        callback(event);
      });
}

function find(selector) {
    return new DOMElement(selector);
}

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

// Weather, on start up
fetch(API_URL).proceed(response => {
    var weatherData = JSON.parse(response);
    var weatherList = weatherData.list;
    var tbody = find('.weather').select('.weather-data');
    var weatherTable = new WeatherTable(tbody.selected);
    var weatherInfo = {
        time: [],
        weather: [],
        temperature: [],
        wind: []
    }

    for (var index = 0; index < 5; index++){
        var time = weatherList[index].dt_txt;
        var date = new Date(time);
        var hour = date.getHours() + ":00";
        var weather = capitalize(weatherList[index].weather[0].description);
        var temp = (weatherList[index].main.temp-273.15).toFixed(0) + 'C';
        var speed = weatherList[index].wind.speed.toFixed(0);
        weatherInfo.time.push(hour);
        weatherInfo.weather.push(weather);
        weatherInfo.temperature.push(temp);
        weatherInfo.wind.push(speed);
    }
    weatherTable.addTableData(weatherInfo);
});

find('.btn').select('.train-data').click(event => {
    fetch(API_URL).proceed(response => {
        var tbody = event.selected;
        var trains = ['42', '43', '42X']
        var arrivals = ['11:00', '12:00', '13:00']
        var departures = ['10:00', '11:00', '12:00']
        var trainInfo = {
            trains: trains,
            arrivals: arrivals,
            departures: departures
        }
        var trainTable = new TrainTable(tbody);
        trainTable.addTableData(trainInfo)
        var departingFrom = "Åker från " + find('.departing-from').select('.departing-from').selected.value;
        find('.traffic-message').select('.traffic-message').selected.innerHTML = "Inga problem i trafiken";
        find('.departing-from-message').select('.departing-from-message').selected.innerHTML = departingFrom;
    });
});

function Table(tbody) {
    this.tbody = tbody;
}

function TrainTable(trainTable) {
    Table.call(this, trainTable);
}

TrainTable.prototype.addTableData = function(data) {
    var html = "";
    for (var index = 0; index < data.trains.length; index++){
        html += `<tr>`;
        html += `<td>` + data.trains[index] + `</td>`
        html += `<td>` + data.departures[index] + `</td>`
        html += `<td>` + data.arrivals[index] + `</td>`
        html += `</tr>`;
    }
    this.tbody.innerHTML = html;
}

function WeatherTable(weatherTable) {
    Table.call(this, weatherTable);
}

WeatherTable.prototype.addTableData = function(data) {
    var html = "";
    for (var index = 0; index < data.weather.length; index++){
        html += `<tr>`;
        html += `<td>` + data.time[index] + `</td>`
        html += `<td>` + data.weather[index] + `</td>`
        html += `<td>` + data.temperature[index] + `</td>`
        html += `<td>` + data.wind[index] + `</td>`
        html += `</tr>`;
    }
    this.tbody.innerHTML = html;
}