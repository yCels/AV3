import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import router from './routes';
import { medidorDeTempo } from './middleware'; 

const app = express();
const prisma = new PrismaClient();

app.use(express.json());


app.use(cors({
  exposedHeaders: ['X-Response-Time'] 
}));


app.use(medidorDeTempo);



app.use(router);

app.get('/status', async (req, res) => {
    res.json({ status: 'OK', mensagem: 'Servidor ON!' });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});