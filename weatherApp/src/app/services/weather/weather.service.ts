import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiKey: string;
  public weatherSevenDays: any;
  public sunriseSunset: any;
  public getCityName: any;
  public i: number = 0;


  constructor(private http: HttpClient, private routes: Router) {
    this.apiKey = "b-Xq8MhhqNUWQT4016csTTQ2j--m8mksCwsnh8GfB-s";
  }

  // public getDailyWeather(coordinates: any) {
  //   this.http.jsonp("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_7days_simple&latitude=" + coordinates.latitude + "&longitude=" + coordinates.longitude + "&apiKey=" + this.apiKey, "jsonpCallback")
  //     .pipe(map(result => { return (<any>result).dailyForecasts } ));
  // }

 public getStatus()
{
  return false;
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
        return  result.forecast;
      }, error => {
        console.error(error);
      });
  }

}
