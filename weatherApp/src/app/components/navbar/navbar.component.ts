import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SocialAuthService } from "angularx-social-login";

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

  constructor(private http: HttpClient, private authServiceSocial: SocialAuthService) {
    this.cityApiKey = "de1669beb6msh6a848aba1581ae0p12ee1bjsna7c1f0599054";
  }

  ngOnInit() {
  }

  async onKeyup(event) {
    if (event.length >= 3) {
      this.getCities(event);
    }
  }

  // Get cities in search
  public getCities(namePrefix: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        "x-rapidapi-key": "de1669beb6msh6a848aba1581ae0p12ee1bjsna7c1f0599054",
      })
    }
    const paramsBody = "&x-rapidapi-key=" + this.cityApiKey + "&limit=" + 10 + "&sort=" + "name" + "&namePrefix=" + namePrefix;

    this.http.get("https://wft-geo-db.p.rapidapi.com/v1/geo/cities?" + paramsBody, httpOptions).toPromise().catch(err => console.log(err)).then(results => {
      this.options = results["data"].map(x => x.name + ", " + x.country);
    }
    ).then(test => {
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  addSelectedCity() {
    let cityName: string = this.myControl.value.slice(0, this.myControl.value.indexOf(','));
    this.city.emit(cityName);
  }

  // Check celsius or fahrenheit
  convert(celOrFah: string) {
    if (celOrFah == 'c') {
      this.celsius = true;
    } else {
      this.celsius = false;
    }
    this.celsiusOrFahrenheit.emit(this.celsius);
  }

  refresh() {
    window.location.reload();
  }

  // Logout and move to homepage
  logOut() {
    localStorage.removeItem('username');
    this.authServiceSocial.signOut();
    window.location.reload();
  }
}
