import React from 'react';
import { Cabecalho } from '../Cabecalho';
import { Button } from '../ui/button';
import { Tela } from '../../types';

interface MenuProps {
  onNavegar: (tela: Tela) => void;
  onSair: () => void;
}

export function Menu({ onNavegar, onSair }: MenuProps) {
  const opcoes = [
    { id: 'aeronaves' as Tela, label: 'Aeronaves' },
    { id: 'cadastros' as Tela, label: 'Cadastros' },
    { id: 'linhasProducao' as Tela, label: 'Linhas de Produção' },
    { id: 'associacoes' as Tela, label: 'Associações' },
    { id: 'funcionarios' as Tela, label: 'Funcionários' },
    { id: 'relatorios' as Tela, label: 'Relatórios' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Cabecalho onSair={onSair} />
      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-3xl text-center text-blue-900 mb-8">Menu Principal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opcoes.map(opcao => (
            <Button
              key={opcao.id}
              onClick={() => onNavegar(opcao.id)}
              className="h-32 text-xl bg-blue-900 hover:bg-blue-800 shadow-lg hover:shadow-xl transition-all"
            >
              {opcao.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
