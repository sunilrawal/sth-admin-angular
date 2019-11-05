import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'menu-bar',
  templateUrl: 'menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})

export class MenuBarComponent implements OnInit {

  @Input() menu: string;

	ngOnInit() { }
}