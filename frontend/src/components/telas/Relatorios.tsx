import React, { useState } from 'react';
import { Cabecalho } from '../Cabecalho';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useDados } from '../../context/DadosContext';

interface RelatoriosProps {
  onVoltar: () => void;
  onSair: () => void;
}

export function Relatorios({ onVoltar, onSair }: RelatoriosProps) {
  const { dados } = useDados();
  const [aeronaveSelecionada, setAeronaveSelecionada] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [relatorio, setRelatorio] = useState('');

  const formatarData = (data: string) => {
    const partes = data.split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    return data;
  };

  const gerarRelatorio = () => {
    if (!aeronaveSelecionada || !nomeCliente || !dataEntrega) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const aeronave = dados.aeronaves.find(a => a.id === parseInt(aeronaveSelecionada));
    if (!aeronave) return;

    const pecasAssociadas = dados.associacoes.pecasAeronaves
      .filter(a => a.aeronaveId === aeronave.id)
      .map(a => dados.pecas.find(p => p.id === a.pecaId))
      .filter(p => p !== undefined);

    const etapasAssociadas = dados.associacoes.etapasAeronaves
      .filter(a => a.aeronaveId === aeronave.id)
      .map(a => dados.etapas.find(e => e.id === a.etapaId))
      .filter(e => e !== undefined);

    const testesAssociados = dados.associacoes.testesAeronaves
      .filter(a => a.aeronaveId === aeronave.id)
      .map(a => dados.testes.find(t => t.id === a.testeId))
      .filter(t => t !== undefined);

    let textoRelatorio = `=========================================
    RELATÓRIO FINAL DE PRODUÇÃO
=========================================

Cliente: ${nomeCliente}
Data de Entrega: ${formatarData(dataEntrega)}

--- Ficha Técnica da Aeronave ---
Código: ${aeronave.codigo}
Modelo: ${aeronave.modelo}
Tipo: ${aeronave.tipo}
Capacidade: ${aeronave.capacidade} passageiros
Alcance: ${aeronave.alcance} km

--- Peças Associadas ---
`;

    if (pecasAssociadas.length > 0) {
      pecasAssociadas.forEach(peca => {
        textoRelatorio += `- ${peca!.nome} (Fornecedor: ${peca!.fornecedor}) - Status: Em Produção\n`;
      });
    } else {
      textoRelatorio += `Nenhuma peça associada.\n`;
    }

    textoRelatorio += `\n--- Plano de Produção (Etapas) ---\n`;

    if (etapasAssociadas.length > 0) {
      etapasAssociadas.forEach(etapa => {
        textoRelatorio += `- ${etapa!.nome} (Prazo: ${formatarData(etapa!.data)}) - Status: ${etapa!.status}\n`;
      });
    } else {
      textoRelatorio += `Nenhuma etapa associada.\n`;
    }

    textoRelatorio += `\n--- Testes Realizados ---\n`;

    if (testesAssociados.length > 0) {
      testesAssociados.forEach(teste => {
        textoRelatorio += `- Teste ${teste!.tipo}: ${teste!.resultado}\n`;
      });
    } else {
      textoRelatorio += `Nenhum teste associado.\n`;
    }

    textoRelatorio += `\n=========================================`;

    setRelatorio(textoRelatorio);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Cabecalho onSair={onSair} />
      <div className="max-w-5xl mx-auto p-6">
        <Button onClick={onVoltar} variant="outline" className="mb-6">
          Voltar
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gerar Relatório de Produção</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Selecione a Aeronave:</Label>
              <Select value={aeronaveSelecionada} onValueChange={setAeronaveSelecionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma aeronave..." />
                </SelectTrigger>
                <SelectContent>
                  {dados.aeronaves.map(aeronave => (
                    <SelectItem key={aeronave.id} value={aeronave.id.toString()}>
                      {aeronave.codigo} - {aeronave.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cliente">Nome do Cliente:</Label>
              <Input
                id="cliente"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                placeholder="Digite o nome do cliente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataEntrega">Data de Entrega:</Label>
              <Input
                id="dataEntrega"
                type="date"
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
              />
            </div>
            <Button onClick={gerarRelatorio} className="w-full bg-blue-900 hover:bg-blue-800">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        {relatorio && (
          <Card>
            <CardContent className="p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {relatorio}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
