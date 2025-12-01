import React, { useState } from 'react';
import { Cabecalho } from '../Cabecalho';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useDados } from '../../context/DadosContext';

interface FuncionariosProps {
  onVoltar: () => void;
  onSair: () => void;
}

export function Funcionarios({ onVoltar, onSair }: FuncionariosProps) {
  const { dados, criarFuncionario, atualizarDados } = useDados(); // Usa a função do banco!
  const [dialogAberto, setDialogAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [novoFunc, setNovoFunc] = useState({
    id: '',
    nome: '',
    telefone: '',
    endereco: '',
    usuario: '',
    senha: '',
    nivel: ''
  });

  // Função para traduzir o nível do select para o formato do banco
  const traduzirNivelParaBanco = (nivel: string) => {
    if (nivel === '1 - Admin') return 'Admin';
    if (nivel === '2 - Engenheiro') return 'Engenheiro';
    if (nivel === '3 - Operador') return 'Operador';
    return '';
  };

  const handleCadastrar = async () => {
    if (!novoFunc.id || !novoFunc.nome || !novoFunc.usuario || !novoFunc.senha || !novoFunc.nivel) {
      alert('Preencha os campos obrigatórios (ID, Nome, Usuário, Senha e Nível)!');
      return;
    }

    setCarregando(true);
    
    // CORREÇÃO: Enviamos para o backend com o nível traduzido
    const sucesso = await criarFuncionario({
      id: novoFunc.id,
      nome: novoFunc.nome,
      telefone: novoFunc.telefone,
      endereco: novoFunc.endereco,
      usuario: novoFunc.usuario,
      senha: novoFunc.senha,
      nivel: traduzirNivelParaBanco(novoFunc.nivel) as any
    });

    if (sucesso) {
      alert('Funcionário salvo no Banco de Dados! 👷');
      setDialogAberto(false);
      setNovoFunc({ id: '', nome: '', telefone: '', endereco: '', usuario: '', senha: '', nivel: '' });
    } else {
      alert('Erro ao cadastrar! Verifique se a matrícula (ID) ou Usuário já existem.');
    }
    setCarregando(false);
  };

  const handleExcluir = (id: string) => {
    // Exclusão visual por enquanto (para o banco precisa de rota DELETE no backend)
    if (confirm('Tem certeza que deseja remover da visualização?')) {
      atualizarDados({ funcionarios: dados.funcionarios.filter(f => f.id !== id) });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Cabecalho onSair={onSair} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onVoltar} variant="outline">
            Voltar
          </Button>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800">
                Cadastrar Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Funcionário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Matrícula (ID):</Label>
                  <Input
                    id="id"
                    value={novoFunc.id}
                    onChange={(e) => setNovoFunc({ ...novoFunc, id: e.target.value })}
                    placeholder="Ex: 1001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo:</Label>
                  <Input
                    id="nome"
                    value={novoFunc.nome}
                    onChange={(e) => setNovoFunc({ ...novoFunc, nome: e.target.value })}
                    placeholder="Ex: Ana Silva"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone:</Label>
                  <Input
                    id="telefone"
                    value={novoFunc.telefone}
                    onChange={(e) => setNovoFunc({ ...novoFunc, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço:</Label>
                  <Input
                    id="endereco"
                    value={novoFunc.endereco}
                    onChange={(e) => setNovoFunc({ ...novoFunc, endereco: e.target.value })}
                    placeholder="Rua, Número..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usuario">Usuário de Login:</Label>
                  <Input
                    id="usuario"
                    value={novoFunc.usuario}
                    onChange={(e) => setNovoFunc({ ...novoFunc, usuario: e.target.value })}
                    placeholder="ana.silva"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha:</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={novoFunc.senha}
                    onChange={(e) => setNovoFunc({ ...novoFunc, senha: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nivel">Nível de Acesso:</Label>
                  <Select 
                    value={novoFunc.nivel} 
                    onValueChange={(value) => setNovoFunc({ ...novoFunc, nivel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 - Admin">1 - Admin</SelectItem>
                      <SelectItem value="2 - Engenheiro">2 - Engenheiro</SelectItem>
                      <SelectItem value="3 - Operador">3 - Operador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCadastrar} className="w-full bg-blue-900 hover:bg-blue-800" disabled={carregando}>
                  {carregando ? 'Salvando...' : 'Cadastrar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.funcionarios.map(func => (
                <TableRow key={func.id}>
                  <TableCell className="font-medium">{func.id}</TableCell>
                  <TableCell>{func.nome}</TableCell>
                  <TableCell>{func.telefone}</TableCell>
                  <TableCell>{func.usuario}</TableCell>
                  <TableCell>
                    {/* Renderização bonita do nível */}
                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                      ${String(func.nivel).includes('Admin') ? 'bg-red-100 text-red-800' : 
                        String(func.nivel).includes('Engenheiro') ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {/* Se vier do banco (Admin) ou local (1 - Admin), mostra legível */}
                      {String(func.nivel)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleExcluir(func.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {dados.funcionarios.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center p-8 text-muted-foreground">Nenhum funcionário cadastrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}