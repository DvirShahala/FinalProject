import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  cityApiKey: string;

  constructor(private http: HttpClient) {
    this.cityApiKey = "de1669beb6msh6a848aba1581ae0p12ee1bjsna7c1f0599054";
  }


  // Get cities in search
  getCities(namePrefix: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        "x-rapidapi-key": "de1669beb6msh6a848aba1581ae0p12ee1bjsna7c1f0599054",
      }),

      params: new HttpParams()
        .set('x-rapidapi-key', this.cityApiKey)
        .set('limit', '10')
        .set('sort', 'name')
        .set('namePrefix', namePrefix)
    }
    return this.http.get("https://wft-geo-db.p.rapidapi.com/v1/geo/cities?", httpOptions);
  }
}
