const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const STORIES_FILE = path.join(__dirname, 'stories.json');

// Lê as histórias do arquivo
function readStories() {
  try {
    const data = fs.readFileSync(STORIES_FILE, 'utf8');
    return JSON.parse(data).stories;
  } catch (error) {
    console.error('Erro ao ler histórias:', error);
    return [];
  }
}

// Salva as histórias no arquivo
function saveStories(stories) {
  try {
    fs.writeFileSync(STORIES_FILE, JSON.stringify({ stories }, null, 2));
  } catch (error) {
    console.error('Erro ao salvar histórias:', error);
    throw error;
  }
}

// Rotas da API
app.get('/api/stories', (req, res) => {
  const stories = readStories();
  res.json(stories);
});

app.get('/api/stories/:id', (req, res) => {
  const stories = readStories();
  const story = stories.find(s => s.id === req.params.id);
  if (!story) {
    return res.status(404).json({ error: 'História não encontrada' });
  }
  res.json(story);
});

app.post('/api/stories', (req, res) => {
  try {
    const stories = readStories();
    const story = req.body;
    stories.push(story);
    saveStories(stories);
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar história' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
}); 