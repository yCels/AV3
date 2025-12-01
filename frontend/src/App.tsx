import React, { useState } from 'react';
import { DadosProvider } from './context/DadosContext';
import { Login } from './components/telas/Login';
import { Menu } from './components/telas/Menu';
import { Aeronaves } from './components/telas/Aeronaves';
import { Cadastros } from './components/telas/Cadastros';
import { LinhasProducao } from './components/telas/LinhasProducao';
import { Associacoes } from './components/telas/Associacoes';
import { Funcionarios } from './components/telas/Funcionarios';
import { Relatorios } from './components/telas/Relatorios';
import { Tela } from './types';
import './styles/globals.css';

export default function App() {
  const [telaAtual, setTelaAtual] = useState<Tela>('login');

  const handleLogin = () => {
    setTelaAtual('menu');
  };

  const handleSair = () => {
    setTelaAtual('login');
  };

  const handleNavegar = (tela: Tela) => {
    setTelaAtual(tela);
  };

  const handleVoltar = () => {
    setTelaAtual('menu');
  };

  return (
    <DadosProvider>
      <div className="min-h-screen">
        {telaAtual === 'login' && <Login onLogin={handleLogin} />}
        {telaAtual === 'menu' && <Menu onNavegar={handleNavegar} onSair={handleSair} />}
        {telaAtual === 'aeronaves' && <Aeronaves onVoltar={handleVoltar} onSair={handleSair} />}
        {telaAtual === 'cadastros' && <Cadastros onVoltar={handleVoltar} onSair={handleSair} />}
        {telaAtual === 'linhasProducao' && <LinhasProducao onVoltar={handleVoltar} onSair={handleSair} />}
        {telaAtual === 'associacoes' && <Associacoes onVoltar={handleVoltar} onSair={handleSair} />}
        {telaAtual === 'funcionarios' && <Funcionarios onVoltar={handleVoltar} onSair={handleSair} />}
        {telaAtual === 'relatorios' && <Relatorios onVoltar={handleVoltar} onSair={handleSair} />}
      </div>
    </DadosProvider>
  );
}
