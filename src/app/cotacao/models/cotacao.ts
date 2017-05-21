import { Cliente } from "app/cotacao/models/cliente";
import { Item } from "app/cotacao/models/item";

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
    item: Item;
}