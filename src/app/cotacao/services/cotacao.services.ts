import { Injectable } from "@angular/core";
import { BaseService } from "app/shared/base.service";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { Cotacao } from "app/cotacao/models/cotacao";
import { TipoSeguro } from "app/cotacao/models/tipoSeguro";
import { TipoCalculo } from "app/cotacao/models/tipoCalculo";

import { Observable } from "rxjs/Observable";

@Injectable()
export class CotacaoService extends BaseService {

    constructor(private http: Http) {
        super();
    }

    public obterUsuario() {
        return JSON.parse(localStorage.getItem('exs.user'));
    }

    registrarCotacao(cotacao: Cotacao): Observable<Cotacao> {
        let options = this.obterAuthHeader();
        cotacao.id = undefined;

        let response = this.http
            .post(this.UrlServiceV1 + "cotacoes", cotacao, options)
            .map(this.extractData)
            .catch((super.serviceError));
        return response;
    };

    obterTipoSeguro(): Observable<TipoSeguro[]> {
        return this.http.get(this.UrlServiceV1 + "cotacoes/tiposseguro")
            .map((res: Response) => <TipoSeguro[]>res.json())
            .catch(super.serviceError);
    }

    obterTiposCalculo(): Observable<TipoCalculo[]> {
        return this.http.get(this.UrlServiceV1 + "cotacoes/tiposcalculo")
            .map((res: Response) => <TipoCalculo[]>res.json())
            .catch(super.serviceError);
    }

    /*    gerarNumCotacaoRandomico(): Observable<number> {
            return this.http.get(this.UrlServiceV1 + "cotacoes/num-rand-cotacoes") 
                .map((res: Response) => <number>res.json())
                .catch(super.serviceError);
        }*/

    private extractData(response: Response) {
        let body = response.json();
        return body.data || {};
    }
}