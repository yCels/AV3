import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DadosSistema, Aeronave, Peca, Etapa, Teste, Funcionario } from '../types';

interface DadosContextType {
  dados: DadosSistema;
  atualizarDados: (novosDados: Partial<DadosSistema>) => void;
  buscarTudo: () => Promise<void>;
  criarAeronave: (item: Omit<Aeronave, 'id'>) => Promise<boolean>;
  criarPeca: (item: Omit<Peca, 'id'>) => Promise<boolean>;
  criarEtapa: (item: Omit<Etapa, 'id'>) => Promise<boolean>;
  criarTeste: (item: Omit<Teste, 'id'>) => Promise<boolean>;
  criarFuncionario: (item: Funcionario) => Promise<boolean>;
  associarItem: (tipo: 'peca' | 'etapa' | 'teste' | 'funcionario', idItem: string | number, idDestino: string | number) => Promise<boolean>;
  atualizarStatusEtapa: (id: number, status: string) => Promise<boolean>;
}

const DadosContext = createContext<DadosContextType | undefined>(undefined);

const dadosIniciais: DadosSistema = {
  aeronaves: [], pecas: [], etapas: [], testes: [], funcionarios: [],
  associacoes: { pecasAeronaves: [], etapasAeronaves: [], testesAeronaves: [], funcionariosEtapas: [] }
};

export function DadosProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<DadosSistema>(dadosIniciais);

  const buscarTudo = async () => {
    try {
      const [resAeronaves, resPecas, resEtapas, resTestes, resFunc] = await Promise.all([
        fetch('http://localhost:3001/aeronaves'),
        fetch('http://localhost:3001/pecas'),
        fetch('http://localhost:3001/etapas'),
        fetch('http://localhost:3001/testes'),
        fetch('http://localhost:3001/funcionarios')
      ]);

      const listaAeronaves = await resAeronaves.json();
      const listaPecas = await resPecas.json();
      const listaEtapas = await resEtapas.json();
      const listaTestes = await resTestes.json();
      const listaFunc = await resFunc.json();

      const novasAssociacoes = {
        pecasAeronaves: [] as any[],
        etapasAeronaves: [] as any[],
        testesAeronaves: [] as any[],
        funcionariosEtapas: [] as any[]
      };

      // Mapeia aeronaves
      listaAeronaves.forEach((av: any) => {
        if(av.pecas) av.pecas.forEach((p: any) => novasAssociacoes.pecasAeronaves.push({ pecaId: p.id, aeronaveId: av.id }));
        if(av.etapas) av.etapas.forEach((e: any) => novasAssociacoes.etapasAeronaves.push({ etapaId: e.id, aeronaveId: av.id }));
        if(av.testes) av.testes.forEach((t: any) => novasAssociacoes.testesAeronaves.push({ testeId: t.id, aeronaveId: av.id }));
      });
      
      // 👇👇👇 AQUI ESTÁ O SEGREDO QUE FALTAVA NO SEU ARQUIVO 👇👇👇
      // Mapeia funcionários nas etapas
      listaEtapas.forEach((et: any) => {
         if(et.funcionarios) {
            et.funcionarios.forEach((f: any) => {
               novasAssociacoes.funcionariosEtapas.push({ funcionarioId: f.id, etapaId: et.id });
            });
         }
      });
      // 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆

      setDados({
        aeronaves: listaAeronaves, pecas: listaPecas, etapas: listaEtapas,
        testes: listaTestes, funcionarios: listaFunc, associacoes: novasAssociacoes
      });
      
    } catch (e) { console.error("Erro ao buscar dados:", e); }
  };

  // Funções Auxiliares (Simplificadas para caber)
  const criar = async (endpoint: string, item: any) => {
    try {
      const resp = await fetch(`http://localhost:3001/${endpoint}`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(item) });
      if (resp.ok) { await buscarTudo(); return true; } return false;
    } catch (e) { return false; }
  };

  const associarItem = async (tipo: string, idItem: string | number, idDestino: string | number) => {
    try {
      let body = {};
      if (tipo === 'peca') body = { pecaId: idItem, aeronaveId: idDestino };
      if (tipo === 'etapa') body = { etapaId: idItem, aeronaveId: idDestino };
      if (tipo === 'teste') body = { testeId: idItem, aeronaveId: idDestino };
      if (tipo === 'funcionario') body = { funcionarioId: idItem, etapaId: idDestino };

      const resp = await fetch(`http://localhost:3001/associacoes/${tipo}`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
      if (resp.ok) { await buscarTudo(); return true; } return false;
    } catch (e) { return false; }
  };

  const atualizarStatusEtapa = async (id: number, status: string) => {
    const resp = await fetch(`http://localhost:3001/etapas/${id}/status`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status }) });
    if (resp.ok) { await buscarTudo(); return true; } return false;
  };

  useEffect(() => { buscarTudo(); }, []);
  const atualizarDados = (novos: Partial<DadosSistema>) => setDados(p => ({ ...p, ...novos }));

  return (
    <DadosContext.Provider value={{ dados, atualizarDados, buscarTudo, criarAeronave: (i) => criar('aeronaves', i), criarPeca: (i) => criar('pecas', i), criarEtapa: (i) => criar('etapas', i), criarTeste: (i) => criar('testes', i), criarFuncionario: (i) => criar('funcionarios', i), associarItem, atualizarStatusEtapa }}>
      {children}
    </DadosContext.Provider>
  );
}

export function useDados() {
  const context = useContext(DadosContext);
  if (!context) throw new Error('useDados deve ser usado dentro de DadosProvider');
  return context;
}