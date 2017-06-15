import { Injectable } from "@angular/core";
import { BaseService } from "app/services/base.service";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { Observable } from "rxjs/Observable";

import { AntiFurto } from "app/cotacao/models/antiFurto";
import { GaragemFaculdade } from "app/cotacao/models/garagemFaculdade";
import { GaragemTrabalho } from "app/cotacao/models/garagemTrabalho";
import { GaragemResidencia } from "app/cotacao/models/garagemResidencia";
import { PropriedadeRastreador } from "app/cotacao/models/propriedadeRastreador";
import { Rastreador } from "app/cotacao/models/rastreador";
import { RelacaoSegurado } from "app/cotacao/models/relacaoSegurado";
import { Questionario } from "app/cotacao/models/questionario";

@Injectable()
export class QuestionarioService extends BaseService {

    constructor(private http: Http) {
        super();
    }

    obterAntiFurtos(): Observable<AntiFurto[]> {
        return this.http.get(this.UrlServiceV1 + "questionarios/ObterAntiFurtos")
            .map((res: Response) => <AntiFurto[]>res.json())
            .catch(super.serviceError);
    }

    obterGaragemFaculdades(): Observable<GaragemFaculdade[]> {
        return this.http.get(this.UrlServiceV1 + "questionarios/ObterGaragemFaculdades")
            .map((res: Response) => <GaragemFaculdade[]>res.json())
            .catch(super.serviceError);
    }

    obterGararemTrabalhos(): Observable<GaragemTrabalho[]> {
        return this.http.get(this.UrlServiceV1 + "questionarios/ObterGararemTrabalhos")
            .map((res: Response) => <GaragemTrabalho[]>res.json())
            .catch(super.serviceError);
    }

    obterGararemResidencias(): Observable<GaragemResidencia[]> {
        return this.http.get(this.UrlServiceV1 + "questionarios/ObterGararemResidencias")
            .map((res: Response) => <GaragemResidencia[]>res.json())
            .catch(super.serviceError);
    }

    obterPropriedadeRastreadors(): Observable<PropriedadeRastreador[]> {
        return this.http.get(this.UrlServiceV1 + "questionarios/ObterPropriedadeRastreadors")
            .map((res: Response) => <PropriedadeRastreador[]>res.json())
            .catch(super.serviceError);
    }

    obterRastreadores(): Observable<Rastreador[]> {
        return this.http.get(this.UrlServiceV1 + "questionarios/ObterRastreadores")
            .map((res: Response) => <Rastreador[]>res.json())
            .catch(super.serviceError);
    }

    obterRelacaoSegurados(): Observable<RelacaoSegurado[]> {
        return this.http.get(this.UrlServiceV1 + "questionarios/ObterRelacaoSegurados")
            .map((res: Response) => <RelacaoSegurado[]>res.json())
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