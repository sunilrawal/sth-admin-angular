import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DatabaseService } from './services/database.service';
import { HttpClientModule } from '@angular/common/http';
import { OrderComponent } from './order/order.component';
import { StatsService } from './services/stats.service';
import { LoginComponent } from './login/login.component';
import { LoginService } from './services/login.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders/:orderId', component: OrderComponent },
    ])
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    DashboardComponent,
    OrderComponent,
    LoginComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [DatabaseService, StatsService, LoginService]
})
export class AppModule { }

