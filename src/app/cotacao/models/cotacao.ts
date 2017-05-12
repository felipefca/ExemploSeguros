import { Cliente } from "app/cotacao/models/cliente";

export class Cotacao {
    id: string;
    numCotacao: string;
    dataVigenciaInicial: Date;
    dataVigenciaFinal: Date;
    userId: string;
    premioTotal: number;
    tipoCalculoId: string;
    tipoSeguroId: string;
    cliente: Cliente;
}