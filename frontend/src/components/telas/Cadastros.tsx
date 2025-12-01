import React, { useState } from 'react';
import { Cabecalho } from '../Cabecalho';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useDados } from '../../context/DadosContext';

interface CadastrosProps {
  onVoltar: () => void;
  onSair: () => void;
}

export function Cadastros({ onVoltar, onSair }: CadastrosProps) {
  const { dados, criarAeronave, criarPeca, criarEtapa, criarTeste } = useDados();
  
  const [dialogAeronave, setDialogAeronave] = useState(false);
  const [dialogPeca, setDialogPeca] = useState(false);
  const [dialogEtapa, setDialogEtapa] = useState(false);
  const [dialogTeste, setDialogTeste] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Estados dos formulários
  const [novaAeronave, setNovaAeronave] = useState({
    codigo: '', modelo: '', tipo: '', capacidade: '', alcance: ''
  });
  const [novaPeca, setNovaPeca] = useState({
    nome: '', tipo: '', fornecedor: ''
  });
  const [novaEtapa, setNovaEtapa] = useState({ nome: '', data: '' });
  const [novoTeste, setNovoTeste] = useState({
    tipo: '',
    resultado: ''
  });

  // --- HANDLERS ---

  const handleCadastrarAeronave = async () => {
    if (!novaAeronave.codigo || !novaAeronave.modelo || !novaAeronave.tipo) {
      alert('Preencha os campos obrigatórios!');
      return;
    }
    setCarregando(true);
    const sucesso = await criarAeronave({
      codigo: novaAeronave.codigo,
      modelo: novaAeronave.modelo,
      tipo: novaAeronave.tipo as any,
      capacidade: Number(novaAeronave.capacidade),
      alcance: Number(novaAeronave.alcance)
    });

    if (sucesso) {
      alert('Aeronave salva no Banco! ✈️');
      setDialogAeronave(false);
      setNovaAeronave({ codigo: '', modelo: '', tipo: '', capacidade: '', alcance: '' });
    } else alert('Erro ao salvar aeronave.');
    setCarregando(false);
  };

  const handleCadastrarPeca = async () => {
    if (!novaPeca.nome || !novaPeca.tipo || !novaPeca.fornecedor) {
      alert('Preencha todos os campos!');
      return;
    }
    setCarregando(true);
    const sucesso = await criarPeca({
      nome: novaPeca.nome,
      tipo: novaPeca.tipo as any,
      fornecedor: novaPeca.fornecedor
    });

    if (sucesso) {
      alert('Peça salva no Banco! 🛠️');
      setDialogPeca(false);
      setNovaPeca({ nome: '', tipo: '', fornecedor: '' });
    } else alert('Erro ao salvar peça.');
    setCarregando(false);
  };

  const handleCadastrarEtapa = async () => {
    if (!novaEtapa.nome || !novaEtapa.data) {
      alert('Preencha todos os campos!');
      return;
    }
    setCarregando(true);
    const sucesso = await criarEtapa({
      nome: novaEtapa.nome,
      data: novaEtapa.data,
      status: 'Pendente'
    });

    if (sucesso) {
      alert('Etapa salva no Banco! 📊');
      setDialogEtapa(false);
      setNovaEtapa({ nome: '', data: '' });
    } else alert('Erro ao salvar etapa.');
    setCarregando(false);
  };

  const handleCadastrarTeste = async () => {
    if (!novoTeste.tipo || !novoTeste.resultado) {
      alert('Preencha todos os campos!');
      return;
    }
    setCarregando(true);
    // IMPORTANTE: Aqui enviamos o código sem acento para o banco
    const sucesso = await criarTeste({
      tipo: novoTeste.tipo as any, 
      resultado: novoTeste.resultado as any
    });

    if (sucesso) {
      alert('Teste salvo no Banco! 🧪');
      setDialogTeste(false);
      setNovoTeste({ tipo: '', resultado: '' });
    } else alert('Erro ao salvar teste.');
    setCarregando(false);
  };

  const formatarData = (data: string) => {
    if (!data) return '-';
    const partes = data.split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    return data;
  };

  // Função para mostrar o nome bonito na tabela (com acento)
  const formatarTipoTeste = (tipo: string) => {
    const mapa: Record<string, string> = {
      'Eletrico': 'Elétrico',
      'Hidraulico': 'Hidráulico',
      'Aerodinamico': 'Aerodinâmico'
    };
    return mapa[tipo] || tipo;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Cabecalho onSair={onSair} />
      <div className="max-w-7xl mx-auto p-6">
        <Button onClick={onVoltar} variant="outline" className="mb-6">
          Voltar
        </Button>

        <Tabs defaultValue="aeronaves" className="bg-white rounded-lg shadow p-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="aeronaves">Aeronaves</TabsTrigger>
            <TabsTrigger value="pecas">Peças</TabsTrigger>
            <TabsTrigger value="etapas">Etapas</TabsTrigger>
            <TabsTrigger value="testes">Testes</TabsTrigger>
          </TabsList>

          {/* ABA AERONAVES */}
          <TabsContent value="aeronaves" className="space-y-4">
            <Dialog open={dialogAeronave} onOpenChange={setDialogAeronave}>
              <DialogTrigger asChild>
                <Button className="bg-blue-900 hover:bg-blue-800">Cadastrar Aeronave</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Cadastrar Aeronave</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Código:</Label><Input value={novaAeronave.codigo} onChange={(e) => setNovaAeronave({ ...novaAeronave, codigo: e.target.value })} placeholder="Digite o código" /></div>
                  <div className="space-y-2"><Label>Modelo:</Label><Input value={novaAeronave.modelo} onChange={(e) => setNovaAeronave({ ...novaAeronave, modelo: e.target.value })} placeholder="Digite o modelo" /></div>
                  <div className="space-y-2"><Label>Tipo:</Label>
                    <Select value={novaAeronave.tipo} onValueChange={(value) => setNovaAeronave({ ...novaAeronave, tipo: value })}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent><SelectItem value="Comercial">Comercial</SelectItem><SelectItem value="Militar">Militar</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Capacidade:</Label><Input type="number" value={novaAeronave.capacidade} onChange={(e) => setNovaAeronave({ ...novaAeronave, capacidade: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Alcance (km):</Label><Input type="number" value={novaAeronave.alcance} onChange={(e) => setNovaAeronave({ ...novaAeronave, alcance: e.target.value })} /></div>
                  <Button onClick={handleCadastrarAeronave} className="w-full bg-blue-900 hover:bg-blue-800" disabled={carregando}>Cadastrar</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Código</TableHead><TableHead>Modelo</TableHead><TableHead>Tipo</TableHead><TableHead>Capacidade</TableHead><TableHead>Alcance</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {dados.aeronaves.map(aeronave => (
                  <TableRow key={aeronave.id}>
                    <TableCell>{aeronave.codigo}</TableCell><TableCell>{aeronave.modelo}</TableCell><TableCell>{aeronave.tipo}</TableCell><TableCell>{aeronave.capacidade}</TableCell><TableCell>{aeronave.alcance} km</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* ABA PEÇAS */}
          <TabsContent value="pecas" className="space-y-4">
            <Dialog open={dialogPeca} onOpenChange={setDialogPeca}>
              <DialogTrigger asChild>
                <Button className="bg-blue-900 hover:bg-blue-800">Cadastrar Peça</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Cadastrar Peça</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Nome:</Label><Input value={novaPeca.nome} onChange={(e) => setNovaPeca({ ...novaPeca, nome: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Tipo:</Label>
                    <Select value={novaPeca.tipo} onValueChange={(value) => setNovaPeca({ ...novaPeca, tipo: value })}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent><SelectItem value="Nacional">Nacional</SelectItem><SelectItem value="Importada">Importada</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Fornecedor:</Label><Input value={novaPeca.fornecedor} onChange={(e) => setNovaPeca({ ...novaPeca, fornecedor: e.target.value })} /></div>
                  <Button onClick={handleCadastrarPeca} className="w-full bg-blue-900 hover:bg-blue-800" disabled={carregando}>Cadastrar</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Table>
              <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead>Fornecedor</TableHead></TableRow></TableHeader>
              <TableBody>
                {dados.pecas.map(peca => (
                  <TableRow key={peca.id}>
                    <TableCell>{peca.id}</TableCell><TableCell>{peca.nome}</TableCell><TableCell>{peca.tipo}</TableCell><TableCell>{peca.fornecedor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* ABA ETAPAS */}
          <TabsContent value="etapas" className="space-y-4">
            <Dialog open={dialogEtapa} onOpenChange={setDialogEtapa}>
              <DialogTrigger asChild>
                <Button className="bg-blue-900 hover:bg-blue-800">Cadastrar Etapa</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Cadastrar Etapa</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Nome:</Label><Input value={novaEtapa.nome} onChange={(e) => setNovaEtapa({ ...novaEtapa, nome: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Data:</Label><Input type="date" value={novaEtapa.data} onChange={(e) => setNovaEtapa({ ...novaEtapa, data: e.target.value })} /></div>
                  <Button onClick={handleCadastrarEtapa} className="w-full bg-blue-900 hover:bg-blue-800" disabled={carregando}>Cadastrar</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Table>
              <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Nome</TableHead><TableHead>Data</TableHead></TableRow></TableHeader>
              <TableBody>
                {dados.etapas.map(etapa => (
                  <TableRow key={etapa.id}>
                    <TableCell>{etapa.id}</TableCell><TableCell>{etapa.nome}</TableCell><TableCell>{formatarData(etapa.data)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* ABA TESTES (AQUI ESTAVA O PROBLEMA!) */}
          <TabsContent value="testes" className="space-y-4">
            <Dialog open={dialogTeste} onOpenChange={setDialogTeste}>
              <DialogTrigger asChild>
                <Button className="bg-blue-900 hover:bg-blue-800">Cadastrar Teste</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Cadastrar Teste</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Tipo:</Label>
                    <Select value={novoTeste.tipo} onValueChange={(value) => setNovoTeste({ ...novoTeste, tipo: value })}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {/* CORREÇÃO: Values sem acento para o Banco, Texto com acento para o Humano */}
                        <SelectItem value="Eletrico">Elétrico</SelectItem>
                        <SelectItem value="Hidraulico">Hidráulico</SelectItem>
                        <SelectItem value="Aerodinamico">Aerodinâmico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Resultado:</Label>
                    <Select value={novoTeste.resultado} onValueChange={(value) => setNovoTeste({ ...novoTeste, resultado: value })}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aprovado">Aprovado</SelectItem>
                        <SelectItem value="Reprovado">Reprovado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCadastrarTeste} className="w-full bg-blue-900 hover:bg-blue-800" disabled={carregando}>Cadastrar</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Table>
              <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Tipo</TableHead><TableHead>Resultado</TableHead></TableRow></TableHeader>
              <TableBody>
                {dados.testes.map(teste => (
                  <TableRow key={teste.id}>
                    <TableCell>{teste.id}</TableCell>
                    
                    <TableCell>{formatarTipoTeste(teste.tipo)}</TableCell>
                    <TableCell>{teste.resultado}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}