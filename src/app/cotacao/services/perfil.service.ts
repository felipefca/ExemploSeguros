import { Injectable } from "@angular/core";
import { BaseService } from "app/services/base.service";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";

import { DistanciaTrabalho } from "app/cotacao/models/distanciaTrabalho";
import { EstadoCivil } from "app/cotacao/models/estadoCivil";
import { QuantidadeVeiculos } from "app/cotacao/models/quantidadeVeiculos";
import { Sexo } from "app/cotacao/models/sexo";
import { TempoHabilitacao } from "app/cotacao/models/tempoHabilitacao";
import { TipoResidencia } from "app/cotacao/models/tipoResidencia";

@Injectable()
export class PerfilService extends BaseService {
    constructor(private http: Http) {
        super();
    }

    ObterDistancias(): Observable<DistanciaTrabalho[]> {
        return this.http.get(this.UrlServiceV1 + "perfil/ObterDistancias")
            .map((res: Response) => <DistanciaTrabalho[]>res.json())
            .catch(super.serviceError);
    }

    ObterEstadoCivis(): Observable<EstadoCivil[]> {
        return this.http.get(this.UrlServiceV1 + "perfil/ObterEstadoCivis")
            .map((res: Response) => <EstadoCivil[]>res.json())
            .catch(super.serviceError);
    }

    ObterQuantidadeVeiculos(): Observable<QuantidadeVeiculos[]> {
        return this.http.get(this.UrlServiceV1 + "perfil/ObterQuantidadeVeiculos")
            .map((res: Response) => <QuantidadeVeiculos[]>res.json())
            .catch(super.serviceError);
    }

    ObterSexos(): Observable<Sexo[]> {
        return this.http.get(this.UrlServiceV1 + "perfil/ObterSexos")
            .map((res: Response) => <Sexo[]>res.json())
            .catch(super.serviceError);
    }

    ObterTempoHabilitacao(): Observable<TempoHabilitacao[]> {
        return this.http.get(this.UrlServiceV1 + "perfil/ObterTempoHabilitacao")
            .map((res: Response) => <TempoHabilitacao[]>res.json())
            .catch(super.serviceError);
    }

    ObterTipoResidencia(): Observable<TipoResidencia[]> {
        return this.http.get(this.UrlServiceV1 + "perfil/ObterTipoResidencia")
            .map((res: Response) => <TipoResidencia[]>res.json())
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