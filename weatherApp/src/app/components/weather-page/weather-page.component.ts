import { Component, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { WeatherService } from "../../services/weather/weather.service"
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


  constructor(private http: HttpClient, private routes: Router, private weatherSrv: WeatherService, private weather: WeatherService) {
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
    //await wait(1000);
    this.getSevenDays(coordinates);
    this.getSunrise(coordinates);
    await wait(1000);
    this.windSpeed = this.weatherSevenDays[0].windSpeed;
    this.WindDirection = this.weatherSevenDays[0].windDesc;
    this.feelsLike = this.weatherSevenDays[0].beaufortDescription;
    this.loading = false;
  }

  public getSevenDays(coordinates: any) {
    const httpOptions = {
      headers: new HttpHeaders({

      })
    }
    const paramsBody = "&latitude=" + coordinates.latitude + "&longitude=" + coordinates.longitude + "&apiKey=" + this.apiKey

    this.http.get("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_7days_simple" + paramsBody, httpOptions).toPromise().catch(err => console.log(err)).then(results => {
      this.weatherSevenDays = results["dailyForecasts"]["forecastLocation"]["forecast"];
      for (const element of this.weatherSevenDays) {
        this.weatherSevenDays[this.i].iconLink = this.weatherSevenDays[this.i].iconLink + "?apiKey=" + this.apiKey;
        this.i++;
      }
    });
  }

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

  public getSunriseTime() {
    this.timeAMFM = this.sunriseSunset[0].sunrise;
    return moment(this.timeAMFM, ["h:mm A"]).format("HH:mm");
  }

  public getSunsetTime() {
    this.timeAMFM = this.sunriseSunset[0].sunset;
    return moment(this.timeAMFM, ["h:mm A"]).format("HH:mm");
  }

  public getUvIndex() {
    return this.weatherSevenDays[0].uvIndex;
  }

  public getUvDetail() {
    return this.weatherSevenDays[0].uvDesc;
  }

  public changeCelsiusToFahrenheit(Celsius: number) {
    return (Celsius * 1.8) + 32;
  }
}