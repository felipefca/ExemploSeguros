import { Injectable } from "@angular/core";
import { BaseService } from "app/services/base.service";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";

import { Coberturas } from "app/cotacao/models/coberturas";

@Injectable()
export class CoberturaService extends BaseService {

    constructor(private http: Http) {
        super();
    }

    obterCoberturas(produtoId: string): Observable<Coberturas[]> {
        return this.http.get(this.UrlServiceV1 + "coberturas/ObterCoberturasProdutos/" + produtoId)
            .map((res: Response) => <Coberturas[]>res.json())
            .catch(super.serviceError);
    }

    verificarFlagBasica(produtoId: string): Observable<any> {
        return this.http.get(this.UrlServiceV1 + "coberturas/VerifyFlagBasic/" + produtoId)
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