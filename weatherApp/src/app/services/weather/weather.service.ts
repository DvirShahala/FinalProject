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


  getAllData(coordinates: any) {
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

    this.http.get("https://weather.ls.hereapi.com/weather/1.0/report.json?product=forecast_astronomy" + paramsBody, httpOptions).toPromise().catch(err => console.log(err)).then(results => {
      this.sunriseSunset = results["astronomy"]["astronomy"];
    });
    
  }


}
