import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
// import { MomentPipe } from '../../pipes/moment/moment.pipe';
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
  public i: number = 0;
  public timeAMFM: string;
  // public dateWeather: MomentPipe;
  

  constructor(private http: HttpClient, private routes: Router) {
    this.apiKey = "b-Xq8MhhqNUWQT4016csTTQ2j--m8mksCwsnh8GfB-s";
    this.weatherSevenDays = [];
  }

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.getSevenDaysWeather(position.coords);
        this.getsunriseSunset(position.coords);
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
}