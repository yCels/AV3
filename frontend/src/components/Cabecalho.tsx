import React from 'react';
import { Button } from './ui/button';

interface CabecalhoProps {
  onSair: () => void;
}

export function Cabecalho({ onSair }: CabecalhoProps) {
  return (
    <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl">AEROCODE - Sistema de Gerenciamento</h1>
      <Button onClick={onSair} variant="destructive">
        Sair
      </Button>
    </div>
  );
}
