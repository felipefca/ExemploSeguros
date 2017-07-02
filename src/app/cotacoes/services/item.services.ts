import { Injectable } from "@angular/core";
import { BaseService } from "app/services/base.service";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";

import { Imposto } from "app/cotacoes/models/imposto";
import { Uso } from "app/cotacoes/models/uso";
import { Marca } from "app/cotacoes/models/marca";
import { Modelo } from "app/cotacoes/models/modelo";

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
        return this.http.get(this.UrlServiceV1 + "itens/ObterNomeModelosMarca/" + marcaId)
            .map((res: Response) => res.json())
            .catch(super.serviceError);
    }

    obterModelosParaSelecao(marcaId: string, nome: string, anoFabricacao: string, anoModelo: string, zeroKm: string): Observable<Modelo[]> {
        return this.http.get(this.UrlServiceV1 + "itens/ObterModelosMarca/" + marcaId + "/" + nome + "/" + anoFabricacao + "/" + anoModelo + "/" + zeroKm)
            .map((res: Response) => <Modelo[]>res.json())
            .catch(super.serviceError);
    }

    obterDadosModeloSelecionado(modeloId: string): Observable<Modelo[]> {
        return this.http.get(this.UrlServiceV1 + "itens/ObterDadosModelo/" + modeloId)
            .map((res: Response) => <Modelo[]>res.json())
            .catch(super.serviceError);
    }

    obterValorModelo(modeloId: string): Observable<any>  {
        return this.http.get(this.UrlServiceV1 + "itens/ObterValorModelo/" + modeloId)
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