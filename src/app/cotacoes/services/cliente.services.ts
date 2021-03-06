import { Injectable } from "@angular/core";
import { BaseService } from "app/services/base.service";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";

import { PaisResidencia } from "app/cotacoes/models/paisResidencia";
import { Profissao } from "app/cotacoes/models/profissao";

@Injectable()
export class ClienteService extends BaseService {

    constructor(private http: Http) {
        super();
    }

    obterPaises(): Observable<PaisResidencia[]> {
        return this.http.get(this.UrlServiceV1 + "clientes/ObterPaises")
            .map((res: Response) => <PaisResidencia[]>res.json())
            .catch(super.serviceError);
    }

    obterProfissoes(): Observable<Profissao[]> {
        return this.http.get(this.UrlServiceV1 + "clientes/ObterProfissoes")
            .map((res: Response) => <Profissao[]>res.json())
            .catch(super.serviceError);
    }

    obterCEP(cep: String): Observable<any> {
        return this.http.get("https://viacep.com.br/ws/" + cep + "/json/")
            .map((res: Response) => res.json())
            .catch(super.serviceError);
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
