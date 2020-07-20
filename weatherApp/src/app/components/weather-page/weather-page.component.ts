import { Component, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
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
  public getCityName: any;
  public i: number = 0;
  public timeAMFM: string;
  public if_celsius: boolean = true;
  

  constructor(private http: HttpClient, private routes: Router) {
    this.apiKey = "b-Xq8MhhqNUWQT4016csTTQ2j--m8mksCwsnh8GfB-s";
    this.weatherSevenDays = [];
    this.sunriseSunset = [];
    this.getCityName = [];
  }

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.getSevenDaysWeather(position.coords);
        this.getsunriseSunset(position.coords);
        this.getNameOfCity(position.coords);
      });
    } else {
      console.error("The browser does not support geolocation...");
    }
  }

  public getSevenDaysWeather(coordinates: any) {
    this.http.jsonp("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_7days_simple&latitude=" + coordinates.latitude + "&longitude=" + coordinates.longitude + "&apiKey=" + this.apiKey, "jsonpCallback")
      .pipe(map(result => (<any>result).dailyForecasts.forecastLocation))
      .subscribe(result => {
        this.weatherSevenDays = result.forecast;
        for (const element of this.weatherSevenDays) {
          this.weatherSevenDays[this.i].iconLink = this.weatherSevenDays[this.i].iconLink + "?apiKey=" + this.apiKey;
          this.i++;
        }
      }, error => {
        console.error(error);
      });
  }

  public getsunriseSunset(coordinates: any) {
    this.http.jsonp("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_astronomy&latitude=" + coordinates.latitude + "&longitude=" + coordinates.longitude + "&apiKey=" + this.apiKey, "jsonpCallback")
      .pipe(map(result => (<any>result).astronomy))
      .subscribe(result => {
        this.sunriseSunset = result.astronomy;
      }, error => {
        console.error(error);
      });
  }

  public getNameOfCity(coordinates: any) {
    this.http.jsonp("https://weather.ls.hereapi.com/weather/1.0/report.json?product=observation&oneobservation=true&latitude=" + coordinates.latitude + "&longitude=" + coordinates.longitude + "&apiKey=" + this.apiKey, "jsonpCallback")
      .pipe(map(result => (<any>result).observations))
      .subscribe(result => {
        this.getCityName = result.location[0].observation;
      }, error => {
        console.error(error);
      });
  }

  public getWindSpeed() {
    return this.weatherSevenDays[0].windSpeed;
  }

  public getWindDirec() {
    return this.weatherSevenDays[0].windDesc;
  }

  public getWindDesc() {
    return this.weatherSevenDays[0].beaufortDescription;
  }

  public getSunriseTime() {
    this.timeAMFM = this.sunriseSunset[0].sunrise;
    return moment(this.timeAMFM, ["h:mm A"]).format("HH:mm"); 
  }
  
  public getSunsetTime() {
    this.timeAMFM = this.sunriseSunset[0].sunset;
    return moment(this.timeAMFM, ["h:mm A"]).format("HH:mm"); 
  }

  public changeCelsiusToFahrenheit(Celsius: number)
  {
    return (Celsius * 1.8) + 32;
  }
}