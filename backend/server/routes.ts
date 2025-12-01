import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// ✈️ 1. ROTAS DE AERONAVES
// ==========================================

// Buscar todas (Incluindo relacionamentos para o Front ver tudo)
router.get('/aeronaves', async (req, res) => {
  try {
    const lista = await prisma.aeronave.findMany({
      include: {
        pecas: true,
        etapas: true,
        testes: true
      }
    });
    res.json(lista);
  } catch (error) {
    console.error("Erro GET /aeronaves:", error);
    res.status(500).json({ error: 'Erro ao buscar aeronaves' });
  }
});

// Criar nova aeronave
router.post('/aeronaves', async (req, res) => {
  const { codigo, modelo, tipo, capacidade, alcance } = req.body;
  try {
    const novo = await prisma.aeronave.create({
      data: {
        codigo,
        modelo,
        tipo,
        capacidade: Number(capacidade),
        alcance: Number(alcance)
      }
    });
    console.log("✈️ Aeronave criada:", novo.codigo);
    res.status(201).json(novo);
  } catch (error) {
    console.error("Erro POST /aeronaves:", error);
    res.status(400).json({ error: 'Erro ao criar aeronave. Código já existe?' });
  }
});

// ==========================================
// 🛠️ 2. ROTAS DE PEÇAS
// ==========================================

router.get('/pecas', async (req, res) => {
  try {
    const lista = await prisma.peca.findMany();
    res.json(lista);
  } catch (error) { res.status(500).json({ error: 'Erro ao buscar peças' }); }
});

router.post('/pecas', async (req, res) => {
  try {
    const novo = await prisma.peca.create({ data: req.body });
    res.status(201).json(novo);
  } catch (error) { res.status(400).json({ error: 'Erro ao criar peça' }); }
});

// ==========================================
// 📊 3. ROTAS DE ETAPAS
// ==========================================

// Buscar etapas (CORREÇÃO AQUI: Inclui funcionários para aparecer na associação!)
router.get('/etapas', async (req, res) => {
  try {
    const lista = await prisma.etapa.findMany({
      include: { funcionarios: true } // <--- ESSENCIAL PARA O FRONTEND
    });
    res.json(lista);
  } catch (error) { res.status(500).json({ error: 'Erro ao buscar etapas' }); }
});

router.post('/etapas', async (req, res) => {
  try {
    const novo = await prisma.etapa.create({ data: req.body });
    res.status(201).json(novo);
  } catch (error) { res.status(400).json({ error: 'Erro ao criar etapa' }); }
});

// Atualizar status (Rota Corrigida com Tradução e Logs)
router.put('/etapas/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`🔄 Tentativa de atualizar Etapa ${id} para: "${status}"`);

  // --- TRADUÇÃO: Front (Texto) -> Prisma (Código) ---
  let statusPrisma = status;
  
  if (status === 'Em Andamento') {
    statusPrisma = 'Em_Andamento';
  } else if (status === 'Concluída' || status === 'Concluida') { // Aceita com ou sem acento
    statusPrisma = 'Concluida';
  } else if (status === 'Pendente') {
    statusPrisma = 'Pendente';
  }

  console.log(`➡️ Traduzido para Prisma: "${statusPrisma}"`);

  try {
    const atualizado = await prisma.etapa.update({
      where: { id: Number(id) },
      data: { status: statusPrisma } 
    });
    console.log("✅ Status atualizado no banco!");
    res.json(atualizado);
  } catch (error) { 
    console.error("❌ ERRO AO ATUALIZAR STATUS:", error); 
    res.status(400).json({ error: 'Erro ao atualizar status', detalhes: String(error) }); 
  }
});

// ==========================================
//  4. ROTAS DE TESTES
// ==========================================

router.get('/testes', async (req, res) => {
  try {
    const lista = await prisma.teste.findMany();
    res.json(lista);
  } catch (error) { res.status(500).json({ error: 'Erro ao buscar testes' }); }
});

router.post('/testes', async (req, res) => {
  try {
    const novo = await prisma.teste.create({ data: req.body });
    res.status(201).json(novo);
  } catch (error) { res.status(400).json({ error: 'Erro ao criar teste' }); }
});

// ==========================================
//  5. ROTAS DE FUNCIONÁRIOS
// ==========================================

router.get('/funcionarios', async (req, res) => {
  try {
    const lista = await prisma.funcionario.findMany();
    res.json(lista);
  } catch (error) { res.status(500).json({ error: 'Erro ao buscar funcionários' }); }
});

router.post('/funcionarios', async (req, res) => {
  try {
    const novo = await prisma.funcionario.create({ data: req.body });
    res.status(201).json(novo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao criar funcionário. ID ou Usuário já existem.' });
  }
});

// ==========================================
//  6. ROTAS DE ASSOCIAÇÃO 
// ==========================================

// Associar Peça -> Aeronave
router.post('/associacoes/peca', async (req, res) => {
  const { aeronaveId, pecaId } = req.body;
  try {
    const atualizado = await prisma.aeronave.update({
      where: { id: Number(aeronaveId) },
      data: { pecas: { connect: { id: Number(pecaId) } } }
    });
    res.json(atualizado);
  } catch (error) { res.status(400).json({ error: 'Erro ao associar peça' }); }
});

// Associar Etapa -> Aeronave
router.post('/associacoes/etapa', async (req, res) => {
  const { aeronaveId, etapaId } = req.body;
  try {
    const atualizado = await prisma.aeronave.update({
      where: { id: Number(aeronaveId) },
      data: { etapas: { connect: { id: Number(etapaId) } } }
    });
    res.json(atualizado);
  } catch (error) { res.status(400).json({ error: 'Erro ao associar etapa' }); }
});

// Associar Teste -> Aeronave
router.post('/associacoes/teste', async (req, res) => {
  const { aeronaveId, testeId } = req.body;
  try {
    const atualizado = await prisma.aeronave.update({
      where: { id: Number(aeronaveId) },
      data: { testes: { connect: { id: Number(testeId) } } }
    });
    res.json(atualizado);
  } catch (error) { res.status(400).json({ error: 'Erro ao associar teste' }); }
});

// Associar Funcionário -> Etapa
router.post('/associacoes/funcionario', async (req, res) => {
  const { funcionarioId, etapaId } = req.body;

  console.log(`🔗 Tentativa: Associar Funcionario "${funcionarioId}" na Etapa ${etapaId}`);

  try {
    // Verifica se a Etapa existe
    const etapaExiste = await prisma.etapa.findUnique({ where: { id: Number(etapaId) } });
    if (!etapaExiste) return res.status(404).json({ error: "Etapa não encontrada." });

    //  Verifica se o Funcionário existe (ID String)
    const idFuncString = String(funcionarioId).trim();
    const funcExiste = await prisma.funcionario.findUnique({ where: { id: idFuncString } });

    if (!funcExiste) {
      console.error(`❌ Funcionário "${idFuncString}" não existe.`);
      return res.status(404).json({ error: `Funcionário não encontrado.` });
    }

 
    const atualizado = await prisma.etapa.update({
      where: { id: Number(etapaId) },
      data: { funcionarios: { connect: { id: idFuncString } } }
    });

    console.log("✅ Associação realizada com sucesso!");

    
    const etapaCompleta = await prisma.etapa.findUnique({
      where: { id: Number(etapaId) },
      include: { funcionarios: true }
    });

    res.json(etapaCompleta);

  } catch (error) {
    console.error("💥 Erro no servidor:", error);
    res.status(400).json({ error: 'Erro interno ao associar', detalhes: String(error) });
  }
});

export default router;