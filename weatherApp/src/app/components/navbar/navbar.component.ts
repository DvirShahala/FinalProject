import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  myControl = new FormControl();
  options: string[];
  filteredOptions: Observable<string[]>;
  private cityApiKey: string;
  celsius: boolean = true;
  @Output() city = new EventEmitter<string>();
  @Output() celsiusOrFahrenheit = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {
    this.cityApiKey = "de1669beb6msh6a848aba1581ae0p12ee1bjsna7c1f0599054";
  }

  ngOnInit() {
    this.allData();
  }

  async allData() {
    const wait = (ms) => new Promise(res => setTimeout(res, ms));
    this.getCities();
    await wait(2000);

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  public getCities() {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        "x-rapidapi-key": "de1669beb6msh6a848aba1581ae0p12ee1bjsna7c1f0599054",
        //"useQueryString": true
      })
    }
    const paramsBody = "&x-rapidapi-key=" + this.cityApiKey + "&limit=" + 10 + "&minPopulation=" + 1000000

    this.http.get("https://wft-geo-db.p.rapidapi.com/v1/geo/cities?" + paramsBody, httpOptions).toPromise().catch(err => console.log(err)).then(results => {
      this.options = results["data"].map(x => x.name + ", " + x.country);

      // while (results["links"][1].rel == "next") {
      //   let hrefBody = results["links"][1].href;
      //   this.http.get("https://wft-geo-db.p.rapidapi.com" + hrefBody , httpOptions).toPromise().catch(err => console.log(err)).then(results => {
      //     this.options += results["data"].map(x => x.country + ", " + x.name);
      //   });
      // }
    }
    )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  addSelectedCity() {
    let cityName: string = this.myControl.value.slice( 0, this.myControl.value.indexOf(','));
    this.city.emit(cityName);
  }

  convert(celOrFah: string) {
    if(celOrFah == 'c') {
      this.celsius = true;
    } else {
      this.celsius = false;
    }
    //this.celsius = !this.celsius;
    this.celsiusOrFahrenheit.emit(this.celsius);
  }

  refresh() {
    window.location.reload();
  }

  logOut() {
    localStorage.removeItem('username');
    window.location.reload();
  }
}
