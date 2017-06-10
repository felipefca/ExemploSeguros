import { Cliente } from "app/cotacao/models/cliente";
import { Item } from "app/cotacao/models/item";
import { Questionario } from "app/cotacao/models/questionario";
import { Perfil } from "app/cotacao/models/perfil";

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
    questionario: Questionario;
    perfil: Perfil;
}