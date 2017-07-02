import { Endereco } from "app/cotacoes/models/endereco";

export class Cliente {
    id: string;
    nome: string;
    sobreNome: string;
    email: string;
    cpf: string;
    telefone: string;
    rg: string;
    dataNascimento: Date;
    profissaoId: string;
    paisResidenciaId: string;
    endereco: Endereco;
}