const fs = require('fs');
const path = require('path');

const STORIES_FILE = path.join(__dirname, 'stories.json');

function saveStory(story) {
  // Lê o arquivo atual
  const data = fs.readFileSync(STORIES_FILE, 'utf8');
  const { stories } = JSON.parse(data);

  // Adiciona nova história
  stories.push(story);

  // Salva de volta no arquivo
  fs.writeFileSync(STORIES_FILE, JSON.stringify({ stories }, null, 2));
}

// Exemplo de uso
const story = {
  id: Date.now().toString(),
  title: "Nova História",
  text: "Era uma vez...",
  votes: 0,
  audioUrl: null,
  imageUrl: "https://exemplo.com/imagem.jpg",
  createdAt: new Date().toISOString()
};

saveStory(story); 