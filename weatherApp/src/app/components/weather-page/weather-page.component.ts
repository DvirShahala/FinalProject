import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WeatherService } from "../../services/weather/weather.service";
import * as moment from "moment";

@Component({
  selector: 'app-weather-page',
  templateUrl: './weather-page.component.html',
  styleUrls: ['./weather-page.component.css']
})
export class WeatherPageComponent implements OnInit {

  weatherSevenDays: any;
  sunriseSunset: any;
  i: number = 0;
  timeAMFM: string;
  if_celsius: boolean = true;
  loading: boolean = true;
  windSpeed: string;
  WindDirection: string;
  feelsLike: string;
  uvIndex: string;
  uvDetail: string;
  currentCity: string;

  constructor(private http: HttpClient, private routes: Router, private weatherSrv: WeatherService) { }

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.getAllData(position.coords);
      });
    } else {
      console.error("The browser does not support geolocation...");
    }
  }

  getAllData(coordinates: any) {
    const promise1 = this.weatherSrv.getSevenDays(coordinates).toPromise();
    const promise2 = this.weatherSrv.getSunrise(coordinates).toPromise();

    Promise.all([promise1, promise2]).then(results => {

      // Seven days result
      this.currentCity = results[0]["dailyForecasts"]["forecastLocation"].city + ', ' + results[0]["dailyForecasts"]["forecastLocation"].country;
      this.weatherSevenDays = results[0]["dailyForecasts"]["forecastLocation"]["forecast"];
      this.setForecastImages(this.weatherSevenDays);
      this.setCardsDetails(this.weatherSevenDays);

      // Sunrise result
      this.sunriseSunset = results[1]["astronomy"]["astronomy"];

      // stop the loading spinner
      this.loading = false;
    });
  }

  // Get forecast for specific city
  getSpecificWeather(cityName: any) {
    this.loading = true;
    const promise1 = this.weatherSrv.getCitySunrise(cityName).toPromise();
    const promise2 = this.weatherSrv.getCityWeather(cityName).toPromise();

    Promise.all([promise1, promise2]).then(results => {
      this.sunriseSunset = results[0]["astronomy"]["astronomy"];

      this.weatherSevenDays = results[1]["dailyForecasts"]["forecastLocation"]["forecast"];
      this.setForecastImages(this.weatherSevenDays);
      this.setCardsDetails(this.weatherSevenDays);

      this.loading = false;
    });
    this.currentCity = cityName;
  }

  public getSunriseTime() {
    this.timeAMFM = this.sunriseSunset[0].sunrise;
    return moment(this.timeAMFM, ["h:mm A"]).format("HH:mm");
  }

  public getSunsetTime() {
    this.timeAMFM = this.sunriseSunset[0].sunset;
    return moment(this.timeAMFM, ["h:mm A"]).format("HH:mm");
  }

  // Convert celsius to fahreneit
  public changeCelsiusToFahrenheit(Celsius: number) {
    return (Celsius * 1.8) + 32;
  }

  public setCardsDetails(weatherArr: any) {
    this.windSpeed = weatherArr[0].windSpeed;
    this.WindDirection = weatherArr[0].windDesc;
    this.feelsLike = weatherArr[0].beaufortDescription;
    this.uvIndex = weatherArr[0].uvIndex;
    this.uvDetail = weatherArr[0].uvDesc;
  }

  public convert(celsius: boolean) {
    this.if_celsius = celsius;
  }

  private setForecastImages(weatherArr: any) {
    weatherArr.forEach(element => {
      // Concatenate the api key with elememt icon link in order to set the correct image
      element.iconLink = element.iconLink + "?apiKey=" + this.weatherSrv.getWeatherApikey();
    });
  }
}