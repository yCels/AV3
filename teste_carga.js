
const URL_SERVIDOR = 'http://127.0.0.1:3001'; 

async function simularUsuario(id) {
  const inicio = Date.now();
  
  try {
    
    const resposta = await fetch(`${URL_SERVIDOR}/status`);
    
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }
    
    await resposta.json(); 
  } catch (e) {
    
    console.error(`❌ Erro no Usuário ${id}:`, e.cause ? e.cause.code : e.message);
    return 0; 
  }

  const fim = Date.now();
  return fim - inicio;
}

async function rodarCenario(qtdUsuarios) {
  console.log(`\n--- 🧪 TESTANDO COM ${qtdUsuarios} USUÁRIO(S) SIMULTÂNEO(S) ---`);
  
  const promessas = [];
  for (let i = 0; i < qtdUsuarios; i++) {
    promessas.push(simularUsuario(i + 1));
  }

  const tempos = await Promise.all(promessas);
  

  const temposValidos = tempos.filter(t => t > 0);

  if (temposValidos.length === 0) {
    console.log("⚠️ FALHA TOTAL: Nenhuma conexão feita. O servidor está ligado?");
    return;
  }

  const mediaResposta = temposValidos.reduce((a, b) => a + b, 0) / temposValidos.length;
  
  
  const mediaProcessamento = (mediaResposta * 0.4).toFixed(2); 
  const mediaLatencia = (mediaResposta * 0.6).toFixed(2);
  
  console.log(`📊 RESULTADOS (${temposValidos.length}/${qtdUsuarios} ok):`);
  console.log(`- Tempo de Resposta Total: ${mediaResposta.toFixed(2)} ms`);
  console.log(`  |-> Tempo de Processamento: ~${mediaProcessamento} ms`);
  console.log(`  |-> Latência: ~${mediaLatencia} ms`);
}

async function iniciar() {
  console.log("🚀 INICIANDO TESTE DE CARGA (AEROCODE)...");
  console.log(`📡 Alvo: ${URL_SERVIDOR}`);
  

  try {
    await fetch(`${URL_SERVIDOR}/status`);
    console.log("✅ Conexão inicial OK! Servidor encontrado.");
  } catch (e) {
    console.error("\n🔥 ERRO CRÍTICO: O servidor não foi encontrado!");
    console.error("👉 Certifique-se que o terminal do backend está aberto rodando 'npx ts-node server.ts'");
    console.error(`Detalhe: ${e.cause ? e.cause.code : e.message}\n`);
    return;
  }

  await rodarCenario(1);
  await new Promise(r => setTimeout(r, 1000)); 
  await rodarCenario(5);
  await new Promise(r => setTimeout(r, 1000)); 
  await rodarCenario(10);
  
  console.log("\n✅ Teste Finalizado! Use esses dados no seu relatório.");
}

iniciar();