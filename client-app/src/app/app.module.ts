import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthGuard } from './services/auth-guard.service';
//import { HomeComponent } from '@app/components/home/home.component';
//import { HttpService } from '@app/services/http.service';
//import { AuthGuard } from '@app/services/auth.guard';
//import { NavMenuComponent } from '@app/components/navmenu/navmenu.component';
//import { CounterComponent } from '@app/components/counter/counter.component';
//import { FetchDataComponent } from '@app/components/fetchdata/fetchdata.component';
import { CallbackComponent } from "./components/callback/callback.component";
//import { TokenInterceptor } from "@app/services/token.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
    NavMenuComponent,
    CounterComponent,
    FetchDataComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: CallbackComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'counter', component: CounterComponent, canActivate: [AuthGuard] },
      { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthGuard] },
      { path: '**', redirectTo: '' }
  ])
  ],
  providers: [
    HttpService,
    AuthGuard,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
