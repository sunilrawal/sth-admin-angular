import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'menu-bar',
    templateUrl: 'menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css']
})

export class MenuBarComponent implements OnInit {

    @Input() menu: string;

    ngOnInit() { }
    constructor(
        private loginService: LoginService
    ) {

    }

    get isSuperAdmin() {
        return this.loginService.isSuperAdmin;
    }
}