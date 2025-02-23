import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

app.listen(3001, () => {
  console.log('Servidor de teste rodando em http://localhost:3001');
}); 