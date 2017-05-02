import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-slider',
  templateUrl: './main-slider.component.html',
  styleUrls: ['./main-slider.component.css']
})
export class MainSliderComponent implements OnInit {

  public token;
  public user;
  public email: string = "";

  constructor() {
    this.token = localStorage.getItem('exs.token');
    this.user = JSON.parse(localStorage.getItem('exs.user'));
  }

  ngOnInit() {
    if (this.user)
      this.email = this.user.email;
  }

  usuarioLogado(): boolean { 
    return this.token !== null;
  }
}
