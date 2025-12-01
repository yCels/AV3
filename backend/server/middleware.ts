import { Request, Response, NextFunction } from 'express';

export function medidorDeTempo(req: Request, res: Response, next: NextFunction) {
  // 1. Liga o cronômetro
  const inicio = Date.now();

  // 2. Escuta quando terminar
  res.on('finish', () => {
    const fim = Date.now();
    const tempoProcessamento = fim - inicio;

    // 3. Apenas IMPRIME no terminal (Seguro!)
    console.log(`⏱️  [${req.method}] ${req.url} - Processou em: ${tempoProcessamento}ms`);

    // REMOVEMOS A LINHA 'res.setHeader' QUE CAUSAVA O ERRO
  });

  next();
}