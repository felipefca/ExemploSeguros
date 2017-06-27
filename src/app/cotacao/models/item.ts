import { Coberturas } from "app/cotacao/models/coberturas";

export class Item {
    id: string;
    numChassi: string;
    flagRemarcado: boolean;
    dataSaida: Date;
    odometro: string;
    produtoId: string;
    modeloId: string;
    usoId: string;
    impostoId: string; 
    listCoberturasItem: Coberturas[];
}