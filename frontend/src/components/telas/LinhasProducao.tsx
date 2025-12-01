import React, { useState } from 'react';
import { Cabecalho } from '../Cabecalho';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useDados } from '../../context/DadosContext';
import { Aeronave } from '../../types';

interface LinhasProducaoProps {
  onVoltar: () => void;
  onSair: () => void;
}

export function LinhasProducao({ onVoltar, onSair }: LinhasProducaoProps) {
  const { dados, atualizarStatusEtapa } = useDados();
  const [aeronaveAtual, setAeronaveAtual] = useState<Aeronave | null>(null);

  const abrirLinhaProducao = (aeronave: Aeronave) => {
    setAeronaveAtual(aeronave);
  };

  const voltarLista = () => {
    setAeronaveAtual(null);
  };

 

  const iniciarEtapa = async (etapaId: number) => {
    
    const sucesso = await atualizarStatusEtapa(etapaId, 'Em Andamento');
    if (!sucesso) alert('Erro ao iniciar a etapa.');
  };

  const finalizarEtapa = async (etapaId: number) => {
    const sucesso = await atualizarStatusEtapa(etapaId, 'Concluída');
    if (!sucesso) alert('Erro ao finalizar a etapa.');
  };

 

  const formatarData = (data: string) => {
    if (!data) return '-';
    const partes = data.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
  };

 
  const normalizarStatus = (status: string) => {
    if (status === 'Em_Andamento') return 'Em Andamento';
    if (status === 'Concluida') return 'Concluída'; 
    return status;
  };

  const getStatusBadge = (statusBruto: string) => {
    const status = normalizarStatus(statusBruto); 
    const classes: { [key: string]: string } = {
      'Pendente': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      'Em Andamento': 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      'Concluída': 'bg-green-100 text-green-800 hover:bg-green-100'
    };
    return <Badge className={classes[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getResultadoBadge = (resultado: string) => {
    const classes: { [key: string]: string } = {
      'Aprovado': 'bg-green-100 text-green-800 hover:bg-green-100',
      'Reprovado': 'bg-red-100 text-red-800 hover:bg-red-100'
    };
    return <Badge className={classes[resultado] || 'bg-gray-100 text-gray-800'}>{resultado}</Badge>;
  };

  if (aeronaveAtual) {
    const etapasAssociadas = dados.associacoes.etapasAeronaves
      .filter(a => a.aeronaveId === aeronaveAtual.id)
      .map(a => dados.etapas.find(e => e.id === a.etapaId))
      .filter((e): e is NonNullable<typeof e> => e !== undefined);

    const testesAssociados = dados.associacoes.testesAeronaves
      .filter(a => a.aeronaveId === aeronaveAtual.id)
      .map(a => dados.testes.find(t => t.id === a.testeId))
      .filter((t): t is NonNullable<typeof t> => t !== undefined);

    const pecasAssociadas = dados.associacoes.pecasAeronaves
      .filter(a => a.aeronaveId === aeronaveAtual.id)
      .map(a => dados.pecas.find(p => p.id === a.pecaId))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    return (
      <div className="min-h-screen bg-gray-100">
        <Cabecalho onSair={onSair} />
        <div className="max-w-7xl mx-auto p-6">
          <Button onClick={voltarLista} variant="outline" className="mb-6">
            Voltar
          </Button>

          <h2 className="text-2xl mb-6 text-blue-900 font-bold">
            Linha de Produção: {aeronaveAtual.codigo}
          </h2>

          <div className="space-y-6">
            {/* Especificações */}
            <Card>
              <CardHeader><CardTitle>Especificações da Aeronave</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="text-sm text-gray-600">Modelo:</p><p className="font-bold text-blue-900">{aeronaveAtual.modelo}</p></div>
                  <div><p className="text-sm text-gray-600">Tipo:</p><p className="font-bold text-blue-900">{aeronaveAtual.tipo}</p></div>
                  <div><p className="text-sm text-gray-600">Capacidade:</p><p className="font-bold text-blue-900">{aeronaveAtual.capacidade} passageiros</p></div>
                  <div><p className="text-sm text-gray-600">Alcance:</p><p className="font-bold text-blue-900">{aeronaveAtual.alcance} km</p></div>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Etapas (AÇÃO PRINCIPAL) */}
            <Card>
              <CardHeader><CardTitle>Etapas de Produção</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Previsão</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {etapasAssociadas.map(etapa => {
                      
                      const statusNormalizado = normalizarStatus(etapa.status);
                      
                      return (
                        <TableRow key={etapa.id}>
                          <TableCell className="font-medium">{etapa.nome}</TableCell>
                          <TableCell>{formatarData(etapa.data)}</TableCell>
                          <TableCell>{getStatusBadge(etapa.status)}</TableCell>
                          <TableCell>
                            {statusNormalizado === 'Pendente' && (
                              <Button onClick={() => iniciarEtapa(etapa.id)} size="sm" className="bg-blue-900 hover:bg-blue-800">
                                Iniciar
                              </Button>
                            )}
                            
                            {statusNormalizado === 'Em Andamento' && (
                              <Button onClick={() => finalizarEtapa(etapa.id)} size="sm" className="bg-green-600 hover:bg-green-700">
                                Finalizar
                              </Button>
                            )}
                            {statusNormalizado === 'Concluída' && (
                              <span className="text-green-600 text-sm font-bold flex items-center">
                                ✓ Concluído
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {etapasAssociadas.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground p-4">Nenhuma etapa associada a esta aeronave.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Tabelas Informativas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Testes de Qualidade</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Resultado</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {testesAssociados.map(teste => (
                        <TableRow key={teste.id}>
                          <TableCell>{teste.tipo}</TableCell>
                          <TableCell>{getResultadoBadge(teste.resultado)}</TableCell>
                        </TableRow>
                      ))}
                      {testesAssociados.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">Nenhum teste associado.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Peças Utilizadas</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Fornecedor</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {pecasAssociadas.map(peca => (
                        <TableRow key={peca.id}>
                          <TableCell>{peca.nome}</TableCell>
                          <TableCell>{peca.fornecedor}</TableCell>
                        </TableRow>
                      ))}
                      {pecasAssociadas.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">Nenhuma peça associada.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Cabecalho onSair={onSair} />
      <div className="max-w-7xl mx-auto p-6">
        <Button onClick={onVoltar} variant="outline" className="mb-6">
          Voltar
        </Button>
        <h2 className="text-2xl mb-6 text-blue-900 font-bold">Selecione uma Aeronave</h2>
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Código</TableHead><TableHead>Modelo</TableHead><TableHead>Tipo</TableHead><TableHead>Ações</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {dados.aeronaves.map(aeronave => (
                <TableRow key={aeronave.id}>
                  <TableCell>{aeronave.codigo}</TableCell>
                  <TableCell>{aeronave.modelo}</TableCell>
                  <TableCell>{aeronave.tipo}</TableCell>
                  <TableCell>
                    <Button onClick={() => abrirLinhaProducao(aeronave)} size="sm" className="bg-blue-900 hover:bg-blue-800">
                      Gerenciar Produção
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {dados.aeronaves.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center p-8 text-muted-foreground">Nenhuma aeronave cadastrada no sistema.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}