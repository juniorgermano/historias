const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
let port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Caminho absoluto para o arquivo stories.json
const STORIES_FILE = path.resolve(__dirname, 'stories.json');

// Cria o arquivo stories.json se não existir
if (!fs.existsSync(STORIES_FILE)) {
  fs.writeFileSync(STORIES_FILE, JSON.stringify({ stories: [] }, null, 2));
}

// Caminho absoluto para o arquivo comments.json
const COMMENTS_FILE = path.resolve(__dirname, 'comments.json');

// Cria o arquivo comments.json se não existir
if (!fs.existsSync(COMMENTS_FILE)) {
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify({ comments: [] }, null, 2));
}

// Funções auxiliares
function readStories() {
  try {
    const data = fs.readFileSync(STORIES_FILE, 'utf8');
    return JSON.parse(data).stories;
  } catch (error) {
    console.error('Erro ao ler histórias:', error);
    return [];
  }
}

function saveStories(stories) {
  try {
    fs.writeFileSync(STORIES_FILE, JSON.stringify({ stories }, null, 2));
  } catch (error) {
    console.error('Erro ao salvar histórias:', error);
    throw error;
  }
}

// Funções auxiliares para comentários
function readComments() {
  try {
    const data = fs.readFileSync(COMMENTS_FILE, 'utf8');
    return JSON.parse(data).comments;
  } catch (error) {
    console.error('Erro ao ler comentários:', error);
    return [];
  }
}

function saveComments(comments) {
  try {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify({ comments }, null, 2));
  } catch (error) {
    console.error('Erro ao salvar comentários:', error);
    throw error;
  }
}

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Histórias Infantis',
    endpoints: {
      stories: {
        get: '/api/stories',
        getById: '/api/stories/:id',
        create: '/api/stories',
        vote: '/api/stories/:id/vote'
      }
    }
  });
});

// Rotas da API
app.get('/api/stories', (req, res) => {
  try {
    const stories = readStories();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórias' });
  }
});

app.get('/api/stories/:id', (req, res) => {
  try {
    const stories = readStories();
    const story = stories.find(s => s.id === req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'História não encontrada' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar história' });
  }
});

app.post('/api/stories', (req, res) => {
  try {
    const stories = readStories();
    const story = req.body;
    stories.push(story);
    saveStories(stories);
    res.status(201).json(story);
  } catch (error) {
    console.error('Erro ao salvar história:', error);
    res.status(500).json({ error: 'Erro ao salvar história' });
  }
});

app.post('/api/stories/:id/vote', (req, res) => {
  try {
    const stories = readStories();
    const story = stories.find(s => s.id === req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'História não encontrada' });
    }
    story.votes += req.body.vote;
    saveStories(stories);
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao votar' });
  }
});

// Rotas para comentários
app.get('/api/stories/:storyId/comments', (req, res) => {
  const comments = readComments()
    .filter(c => c.storyId === req.params.storyId)
    .sort((a, b) => b.votes - a.votes);
  res.json(comments);
});

app.post('/api/stories/:storyId/comments', (req, res) => {
  try {
    const comments = readComments();
    const comment = {
      id: Date.now().toString(),
      storyId: req.params.storyId,
      text: req.body.text,
      author: req.body.author,
      votes: 0,
      createdAt: new Date().toISOString()
    };
    comments.push(comment);
    saveComments(comments);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar comentário' });
  }
});

app.post('/api/comments/:id/vote', (req, res) => {
  try {
    const comments = readComments();
    const comment = comments.find(c => c.id === req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    comment.votes += req.body.vote;
    saveComments(comments);
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao votar no comentário' });
  }
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.path
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Inicia o servidor
function startServer(retries = 0) {
  const server = app.listen(port)
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE' && retries < 3) {
        console.log(`Porta ${port} em uso, tentando próxima porta...`);
        port++;
        startServer(retries + 1);
      } else {
        console.error('Erro ao iniciar servidor:', err);
        process.exit(1);
      }
    })
    .on('listening', () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
      console.log('Endpoints disponíveis:');
      console.log('- GET    /api/stories');
      console.log('- GET    /api/stories/:id');
      console.log('- POST   /api/stories');
      console.log('- POST   /api/stories/:id/vote');
      console.log('- GET    /api/stories/:storyId/comments');
      console.log('- POST   /api/stories/:storyId/comments');
      console.log('- POST   /api/comments/:id/vote');
    });
}

startServer(); 