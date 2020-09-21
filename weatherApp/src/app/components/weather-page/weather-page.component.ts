import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { WeatherService } from "../../services/weather/weather.service";
import * as moment from "moment";

@Component({
  selector: 'app-weather-page',
  templateUrl: './weather-page.component.html',
  styleUrls: ['./weather-page.component.css']
})
export class WeatherPageComponent implements OnInit {

  private apiKey: string;
  public weatherSevenDays: any;
  public sunriseSunset: any;
  public i: number = 0;
  public timeAMFM: string;
  public if_celsius: boolean = true;
  public loading: boolean = true;
  public windSpeed: string;
  public WindDirection: string;
  public feelsLike: string;
  public uvIndex: string;
  public uvDetail: string;
  public currentCity: string;

  constructor(private http: HttpClient, private routes: Router) {
    this.apiKey = "b-Xq8MhhqNUWQT4016csTTQ2j--m8mksCwsnh8GfB-s";
  }

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.getAllData(position.coords);
      });
    } else {
      console.error("The browser does not support geolocation...");
    }
  }

  async getAllData(coordinates: any) {
    const wait = (ms) => new Promise(res => setTimeout(res, ms));
    this.getSevenDays(coordinates);
    this.getSunrise(coordinates);
    await wait(2000);
    this.setCardsDetails(this.weatherSevenDays);
    this.loading = false;
  }

  // Get seven days forecast
  public getSevenDays(coordinates: any) {
    const httpOptions = {
      headers: new HttpHeaders({
      })
    }
    const paramsBody = "&latitude=" + coordinates.latitude + "&longitude=" + coordinates.longitude + "&apiKey=" + this.apiKey

    this.http.get("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_7days_simple" + paramsBody, httpOptions).toPromise().catch(err => console.log(err)).then(results => {
      this.currentCity = results["dailyForecasts"]["forecastLocation"].city + ', ' + results["dailyForecasts"]["forecastLocation"].country;
      this.weatherSevenDays = results["dailyForecasts"]["forecastLocation"]["forecast"];
      for (const element of this.weatherSevenDays) {
        this.weatherSevenDays[this.i].iconLink = this.weatherSevenDays[this.i].iconLink + "?apiKey=" + this.apiKey;
        this.i++;
      }
      this.i = 0;
    });
  }

  // Get forecast for specific city
  async getSpecificWeather(name: any) {
    const wait = (ms) => new Promise(res => setTimeout(res, ms));

    this.getSpecificSunrise(name);
    await wait(200);

    const httpOptions = {
      headers: new HttpHeaders({
      })
    }
    const paramsBody = "&name=" + name + "&apiKey=" + this.apiKey

    this.http.get("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_7days_simple" + paramsBody, httpOptions).toPromise().catch(err => console.log(err)).then(results => {
      this.weatherSevenDays = results["dailyForecasts"]["forecastLocation"]["forecast"];
      for (const element of this.weatherSevenDays) {
        this.weatherSevenDays[this.i].iconLink = this.weatherSevenDays[this.i].iconLink + "?apiKey=" + this.apiKey;
        this.i++;
      }
      this.currentCity = name;
      this.setCardsDetails(this.weatherSevenDays);
      this.i = 0;
    });
  }

  // Get sunrise and sunset forecast
  public getSunrise(coordinates: any) {
    const httpOptions = {
      headers: new HttpHeaders({
      })
    }
    const paramsBody = "&latitude=" + coordinates.latitude + "&longitude=" + coordinates.longitude + "&apiKey=" + this.apiKey

    this.http.get("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_astronomy" + paramsBody, httpOptions).toPromise().catch(err => console.log(err)).then(results => {
      this.sunriseSunset = results["astronomy"]["astronomy"];
    });
  }

  // Get specific sunrise and sunset 
  public getSpecificSunrise(name: any) {
    const httpOptions = {
      headers: new HttpHeaders({
      })
    }
    const paramsBody = "&name=" + name + "&apiKey=" + this.apiKey

    this.http.get("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_astronomy" + paramsBody, httpOptions).toPromise().catch(err => console.log(err)).then(results => {
      this.sunriseSunset = results["astronomy"]["astronomy"];
    });
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

  convert(celsius: boolean) {
    this.if_celsius = celsius;
  }
}