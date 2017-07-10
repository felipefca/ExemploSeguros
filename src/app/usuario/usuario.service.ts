import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/throw';

import { Usuario } from "app/usuario/usuario";
import { BaseService } from "app/services/base.service";

@Injectable()
export class UsuarioService extends BaseService {

    constructor(private http: Http) {
        super();
    }

    registrarUsuario(usuario: Usuario): Observable<Usuario> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        //let jsons = JSON.stringify(usuário);
        let response = this.http
            .post(this.UrlServiceV1 + "novo-usuario", usuario, options)
            .map(this.extractData)
            .catch(this.serviceError);

        return response;
    }

    login(usuario: Usuario): Observable<Usuario> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let response = this.http
            .post(this.UrlServiceV1 + "conta", usuario, options)
            .map(this.extractData)
            .catch(this.serviceError);

        return response;
    }

    private extractData(response: Response) {
        let body = response.json();
        return body.data || {};
    }

    protected serviceError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(error);
        return Observable.throw(error);
    }
}