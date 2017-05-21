import { Injectable } from "@angular/core";
import { BaseService } from "app/services/base.service";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";

import { Imposto } from "app/cotacao/models/imposto";
import { Uso } from "app/cotacao/models/uso";
import { Marca } from "app/cotacao/models/marca";
import { Modelo } from "app/cotacao/models/modelo";

@Injectable()
export class ItemService extends BaseService {

    constructor(private http: Http) {
        super();
    }

    obterImpostos(): Observable<Imposto[]> {
        return this.http.get(this.UrlServiceV1 + "itens/ObterImpostos")
            .map((res: Response) => <Imposto[]>res.json())
            .catch(super.serviceError);
    }

    obterUsos(): Observable<Uso[]> {
        return this.http.get(this.UrlServiceV1 + "itens/ObterUsos")
            .map((res: Response) => <Uso[]>res.json())
            .catch(super.serviceError);
    }

    obterMarcas(): Observable<Marca[]> {
        return this.http.get(this.UrlServiceV1 + "itens/ObterMarcas")
            .map((res: Response) => <Marca[]>res.json())
            .catch(super.serviceError);
    }

    obterNomeModelosMarcas(marcaId: string): Observable<any> {
        return this.http.get(this.UrlServiceV1 + "itens/ObterNomeModelosMarca", marcaId)
            .map((res: Response) => <any>res.json())
            .catch(super.serviceError);
    }

    obterModelosParaSelecao(marcaId: string, nome: string, anoFabricacao: string, anoModelo: string): Observable<Modelo[]> {
        let params = new URLSearchParams();
        params.set('marcaId', marcaId);
        params.set('nome', nome);
        params.set('anoFabricacao', anoFabricacao);
        params.set('anoModelo', anoModelo);

        return this.http.get(this.UrlServiceV1 + "itens/ObterModelosMarca", { search: params })
            .map((res: Response) => <Modelo[]>res.json())
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