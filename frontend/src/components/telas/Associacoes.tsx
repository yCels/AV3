import React, { useState } from 'react';
import { Cabecalho } from '../Cabecalho';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { useDados } from '../../context/DadosContext';

interface AssociacoesProps {
  onVoltar: () => void;
  onSair: () => void;
}

export function Associacoes({ onVoltar, onSair }: AssociacoesProps) {
  
  const { dados, associarItem } = useDados();
  
  const [pecaSelecionada, setPecaSelecionada] = useState('');
  const [aeronaveParaPeca, setAeronaveParaPeca] = useState('');
  
  const [etapaSelecionada, setEtapaSelecionada] = useState('');
  const [aeronaveParaEtapa, setAeronaveParaEtapa] = useState('');
  
  const [testeSelecionado, setTesteSelecionado] = useState('');
  const [aeronaveParaTeste, setAeronaveParaTeste] = useState('');
  
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');
  const [etapaParaFunc, setEtapaParaFunc] = useState('');

  // --- FUNÇÕES DE ASSOCIAÇÃO (CONECTADAS AO BANCO) ---

  const associarPecaAeronave = async () => {
    if (!pecaSelecionada || !aeronaveParaPeca) {
      alert('Por favor, selecione uma peça e uma aeronave!');
      return;
    }

    // Chama o backend para criar o vínculo
    const sucesso = await associarItem('peca', pecaSelecionada, aeronaveParaPeca);

    if (sucesso) {
      alert('Peça associada à aeronave com sucesso! 🔗');
      setPecaSelecionada('');
      setAeronaveParaPeca('');
    } else {
      alert('Erro ao associar! Verifique se essa peça já não está associada.');
    }
  };

  const associarEtapaAeronave = async () => {
    if (!etapaSelecionada || !aeronaveParaEtapa) {
      alert('Por favor, selecione uma etapa e uma aeronave!');
      return;
    }

    const sucesso = await associarItem('etapa', etapaSelecionada, aeronaveParaEtapa);

    if (sucesso) {
      alert('Etapa associada à aeronave com sucesso! 🔗');
      setEtapaSelecionada('');
      setAeronaveParaEtapa('');
    } else {
      alert('Erro ao associar etapa.');
    }
  };

  const associarTesteAeronave = async () => {
    if (!testeSelecionado || !aeronaveParaTeste) {
      alert('Por favor, selecione um teste e uma aeronave!');
      return;
    }

    const sucesso = await associarItem('teste', testeSelecionado, aeronaveParaTeste);

    if (sucesso) {
      alert('Teste associado à aeronave com sucesso! 🔗');
      setTesteSelecionado('');
      setAeronaveParaTeste('');
    } else {
      alert('Erro ao associar teste.');
    }
  };

  const associarFuncionarioEtapa = async () => {
    if (!funcionarioSelecionado || !etapaParaFunc) {
      alert('Por favor, selecione um funcionário e uma etapa!');
      return;
    }

    const sucesso = await associarItem('funcionario', funcionarioSelecionado, etapaParaFunc);

    if (sucesso) {
      alert('Funcionário associado à etapa com sucesso! 🔗');
      setFuncionarioSelecionado('');
      setEtapaParaFunc('');
    } else {
      alert('Erro ao associar funcionário.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Cabecalho onSair={onSair} />
      <div className="max-w-7xl mx-auto p-6">
        <Button onClick={onVoltar} variant="outline" className="mb-6">
          Voltar
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CARD 1: PEÇAS -> AERONAVE */}
          <Card>
            <CardHeader>
              <CardTitle>Associar Peça a Aeronave</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Peça:</Label>
                <Select value={pecaSelecionada} onValueChange={setPecaSelecionada}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma peça..." /></SelectTrigger>
                  <SelectContent>
                    {dados.pecas.map(peca => (
                      <SelectItem key={peca.id} value={peca.id.toString()}>{peca.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Aeronave:</Label>
                <Select value={aeronaveParaPeca} onValueChange={setAeronaveParaPeca}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma aeronave..." /></SelectTrigger>
                  <SelectContent>
                    {dados.aeronaves.map(aeronave => (
                      <SelectItem key={aeronave.id} value={aeronave.id.toString()}>
                        {aeronave.codigo} - {aeronave.modelo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={associarPecaAeronave} className="w-full bg-blue-900 hover:bg-blue-800">
                Associar
              </Button>
              
              {/* Lista visual das associações (vinda do banco) */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                <h4 className="mb-2 font-bold text-sm text-gray-700">Associações Ativas:</h4>
                {dados.associacoes.pecasAeronaves.map((assoc, idx) => {
                  const peca = dados.pecas.find(p => p.id === assoc.pecaId);
                  const aeronave = dados.aeronaves.find(a => a.id === assoc.aeronaveId);
                  if (!peca || !aeronave) return null;
                  return (
                    <div key={idx} className="p-2 mb-2 bg-white rounded border-l-4 border-blue-900 text-sm shadow-sm">
                      <span className="font-semibold">{peca.nome}</span> ➝ {aeronave.codigo}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: ETAPAS -> AERONAVE */}
          <Card>
            <CardHeader>
              <CardTitle>Associar Etapa a Aeronave</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Etapa:</Label>
                <Select value={etapaSelecionada} onValueChange={setEtapaSelecionada}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma etapa..." /></SelectTrigger>
                  <SelectContent>
                    {dados.etapas.map(etapa => (
                      <SelectItem key={etapa.id} value={etapa.id.toString()}>{etapa.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Aeronave:</Label>
                <Select value={aeronaveParaEtapa} onValueChange={setAeronaveParaEtapa}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma aeronave..." /></SelectTrigger>
                  <SelectContent>
                    {dados.aeronaves.map(aeronave => (
                      <SelectItem key={aeronave.id} value={aeronave.id.toString()}>
                        {aeronave.codigo} - {aeronave.modelo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={associarEtapaAeronave} className="w-full bg-blue-900 hover:bg-blue-800">
                Associar
              </Button>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                <h4 className="mb-2 font-bold text-sm text-gray-700">Associações Ativas:</h4>
                {dados.associacoes.etapasAeronaves.map((assoc, idx) => {
                  const etapa = dados.etapas.find(e => e.id === assoc.etapaId);
                  const aeronave = dados.aeronaves.find(a => a.id === assoc.aeronaveId);
                  if (!etapa || !aeronave) return null;
                  return (
                    <div key={idx} className="p-2 mb-2 bg-white rounded border-l-4 border-blue-900 text-sm shadow-sm">
                      <span className="font-semibold">{etapa.nome}</span> ➝ {aeronave.codigo}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: TESTES -> AERONAVE */}
          <Card>
            <CardHeader>
              <CardTitle>Associar Teste a Aeronave</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Teste:</Label>
                <Select value={testeSelecionado} onValueChange={setTesteSelecionado}>
                  <SelectTrigger><SelectValue placeholder="Selecione um teste..." /></SelectTrigger>
                  <SelectContent>
                    {dados.testes.map(teste => (
                      <SelectItem key={teste.id} value={teste.id.toString()}>
                        {teste.tipo} - {teste.resultado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Aeronave:</Label>
                <Select value={aeronaveParaTeste} onValueChange={setAeronaveParaTeste}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma aeronave..." /></SelectTrigger>
                  <SelectContent>
                    {dados.aeronaves.map(aeronave => (
                      <SelectItem key={aeronave.id} value={aeronave.id.toString()}>
                        {aeronave.codigo} - {aeronave.modelo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={associarTesteAeronave} className="w-full bg-blue-900 hover:bg-blue-800">
                Associar
              </Button>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                <h4 className="mb-2 font-bold text-sm text-gray-700">Associações Ativas:</h4>
                {dados.associacoes.testesAeronaves.map((assoc, idx) => {
                  const teste = dados.testes.find(t => t.id === assoc.testeId);
                  const aeronave = dados.aeronaves.find(a => a.id === assoc.aeronaveId);
                  if (!teste || !aeronave) return null;
                  return (
                    <div key={idx} className="p-2 mb-2 bg-white rounded border-l-4 border-blue-900 text-sm shadow-sm">
                      <span className="font-semibold">{teste.tipo}</span> ➝ {aeronave.codigo}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* CARD 4: FUNCIONÁRIO -> ETAPA */}
          <Card>
            <CardHeader>
              <CardTitle>Associar Funcionário a Etapa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Funcionário:</Label>
                <Select value={funcionarioSelecionado} onValueChange={setFuncionarioSelecionado}>
                  <SelectTrigger><SelectValue placeholder="Selecione um funcionário..." /></SelectTrigger>
                  <SelectContent>
                    {dados.funcionarios.map(func => (
                      <SelectItem key={func.id} value={func.id}>{func.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Etapa:</Label>
                <Select value={etapaParaFunc} onValueChange={setEtapaParaFunc}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma etapa..." /></SelectTrigger>
                  <SelectContent>
                    {dados.etapas.map(etapa => (
                      <SelectItem key={etapa.id} value={etapa.id.toString()}>{etapa.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={associarFuncionarioEtapa} className="w-full bg-blue-900 hover:bg-blue-800">
                Associar
              </Button>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                <h4 className="mb-2 font-bold text-sm text-gray-700">Associações Ativas:</h4>
                {dados.associacoes.funcionariosEtapas.map((assoc, idx) => {
                  const func = dados.funcionarios.find(f => f.id === assoc.funcionarioId);
                  const etapa = dados.etapas.find(e => e.id === assoc.etapaId);
                  if (!func || !etapa) return null;
                  return (
                    <div key={idx} className="p-2 mb-2 bg-white rounded border-l-4 border-blue-900 text-sm shadow-sm">
                      <span className="font-semibold">{func.nome}</span> ➝ {etapa.nome}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}