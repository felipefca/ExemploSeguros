import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-principal',
  templateUrl: './main-principal.component.html',
  styleUrls: ['./main-principal.component.css']
})
export class MainPrincipalComponent implements OnInit {

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
