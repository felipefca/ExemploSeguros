import { Cliente } from "app/cotacoes/models/cliente";
import { Item } from "app/cotacoes/models/item";
import { Questionario } from "app/cotacoes/models/questionario";
import { Perfil } from "app/cotacoes/models/perfil";

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