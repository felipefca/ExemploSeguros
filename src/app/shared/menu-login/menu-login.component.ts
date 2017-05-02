import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-menu-login',
  templateUrl: './menu-login.component.html',
  styleUrls: ['./menu-login.component.css']
})
export class MenuLoginComponent implements OnInit {

  public token;
  public user;
  public email: string = "";

  constructor(private router: Router) {

    this.token = localStorage.getItem('exs.token');
    this.user = JSON.parse(localStorage.getItem('exs.user'));
  }

  usuarioLogado(): boolean {
    return this.token !== null;
  }

  logout() {
    localStorage.removeItem('exs.token');
    localStorage.removeItem('exs.user');
    this.router.navigateByUrl('/home');
  }

  ngOnInit() {
    if (this.user)
      this.email = this.user.email;
  }

}
