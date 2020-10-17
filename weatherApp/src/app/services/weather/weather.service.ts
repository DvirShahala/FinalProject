import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  apiKey: string;
  weatherSevenDays: any;
  sunriseSunset: any;
  getCityName: any;
  i: number = 0;

  constructor(private http: HttpClient) {
    this.apiKey = "b-Xq8MhhqNUWQT4016csTTQ2j--m8mksCwsnh8GfB-s";
  }

  getWeatherApikey() {
    return this.apiKey;
  }

  // Get seven days forecast
  getSevenDays(coordinates: any) {

    const params = new HttpParams()
    .set('latitude', coordinates.latitude)
    .set('longitude', coordinates.longitude)
    .set('apiKey', this.apiKey);

    return this.http.get("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_7days_simple", {params: params});
  }

  // Get specific sunrise and sunset 
  getCitySunrise(name: any) {

    const params = new HttpParams()
    .set('name', name)
    .set('apiKey', this.apiKey);

    return this.http.get("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_astronomy", {params: params});
  }

  // Get forecast for specific city
  getCityWeather(name: any) {

    const params = new HttpParams()
    .set('name', name)
    .set('apiKey', this.apiKey);

    return this.http.get("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_7days_simple", {params: params});
  }

  //Get sunrise and sunset forecast
  public getSunrise(coordinates: any) {

    const params = new HttpParams()
    .set('latitude', coordinates.latitude)
    .set('longitude', coordinates.longitude)
    .set('apiKey', this.apiKey);

    return this.http.get("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_astronomy" , {params: params});
  }
}
