import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material-module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { PopUpComponent } from './components/pop-up/pop-up.component';

// import { WheatherPageComponent } from './components/wheather-page/wheather-page.component';
// import { MomentPipe } from './/pipes/moment/moment.pipe';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    PopUpComponent    
  ],
  imports: [
    BrowserAnimationsModule,
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
