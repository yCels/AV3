import React, { useState } from 'react';
import { Cabecalho } from '../Cabecalho';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useDados } from '../../context/DadosContext';

interface AeronavesProps {
  onVoltar: () => void;
  onSair: () => void;
}

export function Aeronaves({ onVoltar, onSair }: AeronavesProps) {
  const { dados, criarAeronave, atualizarDados } = useDados();
  const [dialogAberto, setDialogAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [novaAeronave, setNovaAeronave] = useState({
    codigo: '', modelo: '', tipo: '', capacidade: '', alcance: ''
  });

  const handleCadastrar = async () => {
    if (!novaAeronave.codigo || !novaAeronave.modelo || !novaAeronave.tipo) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    setCarregando(true);
    // CORREÇÃO: Não enviamos ID. O Backend cria o ID 1, 2, 3...
    const sucesso = await criarAeronave({
      codigo: novaAeronave.codigo,
      modelo: novaAeronave.modelo,
      tipo: novaAeronave.tipo as 'Comercial' | 'Militar',
      capacidade: parseInt(novaAeronave.capacidade || '0'),
      alcance: parseInt(novaAeronave.alcance || '0')
    });

    if (sucesso) {
      alert('Aeronave salva no Banco de Dados! ✈️');
      setDialogAberto(false);
      setNovaAeronave({ codigo: '', modelo: '', tipo: '', capacidade: '', alcance: '' });
    } else {
      alert('Erro ao salvar. Verifique se o servidor está rodando.');
    }
    setCarregando(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Cabecalho onSair={onSair} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onVoltar} variant="outline">Voltar</Button>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800">Cadastrar Aeronave</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nova Aeronave</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Código</Label><Input value={novaAeronave.codigo} onChange={e => setNovaAeronave({...novaAeronave, codigo: e.target.value})} placeholder="Ex: B737" /></div>
                <div className="space-y-2"><Label>Modelo</Label><Input value={novaAeronave.modelo} onChange={e => setNovaAeronave({...novaAeronave, modelo: e.target.value})} placeholder="Ex: Boeing 737" /></div>
                <div className="space-y-2"><Label>Tipo</Label>
                  <Select value={novaAeronave.tipo} onValueChange={v => setNovaAeronave({...novaAeronave, tipo: v})}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent><SelectItem value="Comercial">Comercial</SelectItem><SelectItem value="Militar">Militar</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Capacidade</Label><Input type="number" value={novaAeronave.capacidade} onChange={e => setNovaAeronave({...novaAeronave, capacidade: e.target.value})} /></div>
                <div className="space-y-2"><Label>Alcance (km)</Label><Input type="number" value={novaAeronave.alcance} onChange={e => setNovaAeronave({...novaAeronave, alcance: e.target.value})} /></div>
                <Button onClick={handleCadastrar} className="w-full bg-blue-900" disabled={carregando}>{carregando ? 'Salvando...' : 'Cadastrar'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Código</TableHead><TableHead>Modelo</TableHead><TableHead>Tipo</TableHead><TableHead>Capacidade</TableHead><TableHead>Alcance</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {dados.aeronaves.map(av => (
                <TableRow key={av.id}>
                  <TableCell>{av.codigo}</TableCell>
                  <TableCell>{av.modelo}</TableCell>
                  <TableCell>{av.tipo}</TableCell>
                  <TableCell>{av.capacidade}</TableCell>
                  <TableCell>{av.alcance} km</TableCell>
                </TableRow>
              ))}
              {dados.aeronaves.length === 0 && <TableRow><TableCell colSpan={5} className="text-center p-4">Nenhuma aeronave encontrada.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}