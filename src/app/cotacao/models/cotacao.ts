export class Cotacao{
    id: string;
    numCotacao: string;
    dataCalculo: Date;
    dataCadastro: Date;
    dataVigenciaInicial: Date;
    dataVigenciaFinal: Date;
    userId: string;
    premioTotal: number;
    tipoCalculoId: string;
    tipoSeguroId: string;
}