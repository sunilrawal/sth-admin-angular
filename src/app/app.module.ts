import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StoreComponent } from './components/store/store.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { DBApiService } from './services/dbapi.service';
import { HttpClientModule } from '@angular/common/http';
import { OrderComponent } from './components/order/order.component';
import { StatsService } from './services/stats.service';
import { LoginComponent } from './components/login/login.component';
import { LoginService } from './services/login.service';
import { OrdersService } from './services/orders.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'store', component: StoreComponent },
      { path: 'orders/:orderId', component: OrderComponent },
    ],
    { scrollPositionRestoration: 'enabled' })
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    DashboardComponent,
    StoreComponent,
    OrderComponent,
    LoginComponent,
    MenuBarComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [DBApiService, StatsService, LoginService, OrdersService]
})
export class AppModule { }

