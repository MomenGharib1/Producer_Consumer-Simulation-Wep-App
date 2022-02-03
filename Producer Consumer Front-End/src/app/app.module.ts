import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ProducerConsumerDiagramComponent} from './producer-consumer-diagram/producer-consumer-diagram.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ProdService} from "./Services/prod.service";

@NgModule({
  declarations: [
    AppComponent,
    ProducerConsumerDiagramComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatGridListModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [ProdService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}
