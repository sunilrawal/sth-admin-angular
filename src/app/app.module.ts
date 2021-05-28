import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppComponent } from './app.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { StatspanelComponent } from './components/statspanel/statspanel.component';
import { SthComponent } from './components/sth/sth.component';
import { WalgreensComponent } from './components/walgreens/walgreens.component';
import { CvsComponent } from './components/cvs/cvs.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { DBApiService } from './services/dbapi.service';
import { HttpClientModule } from '@angular/common/http';
import { OrderComponent } from './components/order/order.component';
import { StatsService } from './services/stats.service';
import { LoginComponent } from './components/login/login.component';
import { LoginService } from './services/login.service';
import { OrdersService } from './services/orders.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResearchComponent } from './components/research/research.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxChartsModule,
    BrowserAnimationsModule ,
    NgbModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'sth', component: SthComponent },
      { path: 'walgreens', component: WalgreensComponent },
      { path: 'cvs', component: CvsComponent },
      { path: 'research', component: ResearchComponent},
      { path: 'orders/:orderId', component: OrderComponent },
    ],
    { scrollPositionRestoration: 'enabled' })
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    DashboardComponent,
    StatspanelComponent,
    SthComponent,
    WalgreensComponent,
    CvsComponent,
    OrderComponent,
    LoginComponent,
    ResearchComponent,
    MenuBarComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [DBApiService, StatsService, LoginService, OrdersService]
})
export class AppModule { }

