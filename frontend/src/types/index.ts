// Tipos do sistema AEROCODE

export interface Aeronave {
  id: number;
  codigo: string;
  modelo: string;
  tipo: 'Comercial' | 'Militar';
  capacidade: number;
  alcance: number;
}

export interface Peca {
  id: number;
  nome: string;
  tipo: 'Nacional' | 'Importada';
  fornecedor: string;
}

export interface Etapa {
  id: number;
  nome: string;
  data: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluída';
}

export interface Teste {
  id: number;
  tipo: 'Elétrico' | 'Hidráulico' | 'Aerodinâmico';
  resultado: 'Aprovado' | 'Reprovado';
}

export interface Funcionario {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivel: '1 - Admin' | '2 - Engenheiro' | '3 - Operador';
}

export interface Associacoes {
  pecasAeronaves: Array<{ pecaId: number; aeronaveId: number }>;
  etapasAeronaves: Array<{ etapaId: number; aeronaveId: number }>;
  testesAeronaves: Array<{ testeId: number; aeronaveId: number }>;
  funcionariosEtapas: Array<{ funcionarioId: string; etapaId: number }>;
}

export interface DadosSistema {
  aeronaves: Aeronave[];
  pecas: Peca[];
  etapas: Etapa[];
  testes: Teste[];
  funcionarios: Funcionario[];
  associacoes: Associacoes;
}

export type Tela = 
  | 'login' 
  | 'menu' 
  | 'aeronaves' 
  | 'cadastros' 
  | 'linhasProducao' 
  | 'associacoes' 
  | 'funcionarios' 
  | 'relatorios';
