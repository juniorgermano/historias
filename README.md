# 🎨 Histórias Infantis AI

Sistema mágico de geração e compartilhamento de histórias infantis usando IA.

## ✨ Design e Interface

- 🎨 Design infantil e colorido
- 🌈 Gradientes suaves e vibrantes
- 💫 Animações e efeitos interativos
- 🔤 Fonte especial "Pacifico" para títulos
- 🎯 Botões grandes e intuitivos
- 📱 Layout responsivo e amigável

### Cores

- 🌸 Rosa Pastel (`#FFB6C1`) - Títulos e botões principais
- 💙 Azul Céu (`#87CEEB`) - Botões e destaques
- 🌿 Verde Suave (`#98FF98`) - Acentos e interações
- 🤍 Branco com Transparência - Cards e fundos
- 🎨 Gradientes - Combinações suaves das cores acima

### Componentes

1. **Cards e Containers**
   - Fundo branco com transparência
   - Bordas arredondadas e suaves
   - Sombras leves para profundidade
   - Efeito de vidro (glass effect)

2. **Botões**
   - Gradientes coloridos
   - Hover com opacidade
   - Versões circulares para ações
   - Sombras e transições suaves

3. **Textos**
   - Títulos com gradiente
   - Fonte Pacifico para destaque
   - Cores suaves para leitura
   - Espaçamento confortável

## 🚀 Funcionalidades

- 🎨 Geração de histórias com IA
- 🎵 Narração em áudio
- 👥 Compartilhamento fácil
- 👍 Sistema de votos
- 💬 Compartilhamento via WhatsApp
- 🌈 Interface colorida e interativa

## 💻 Desenvolvimento

1. Clone o projeto:
```bash
git clone <seu-repositorio>
cd historias-infantis
```

2. Instale as dependências:
```bash
# Frontend
npm install

# Backend
cd api
npm install
```

3. Configure o ambiente:
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3001
VITE_N8N_WEBHOOK_URL=http://seu-n8n/webhook/historias

# Backend (api/.env)
PORT=3001
```

4. Inicie o projeto:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd api
npm run dev
```

## 📁 Estrutura

```
.
├── api/                    # Backend
│   ├── index.js           # Servidor Express
│   ├── stories.json       # Banco de dados
│   └── package.json       # Dependências
├── src/                   # Frontend
│   ├── components/        # Componentes React
│   │   ├── StoryForm     # Formulário
│   │   ├── StoryCard     # Card de história
│   │   ├── StoryList     # Lista de histórias
│   │   └── StoryResult   # História completa
│   ├── pages/            # Páginas
│   └── services/         # API
└── package.json          # Dependências
```

## 🎯 Como Usar

1. **Criar História**
   - Digite o nome da criança
   - Escolha o tipo de história
   - Adicione detalhes especiais
   - Clique no botão colorido "Gerar História"

2. **Ler História**
   - Veja o texto em cards bonitos
   - Ouça a narração (se disponível)
   - Compartilhe no WhatsApp
   - Vote nas histórias que gostar

3. **Explorar Histórias**
   - Veja histórias em cards coloridos
   - Ordene por mais votadas
   - Leia trechos das histórias
   - Salve suas favoritas

## 🔧 Solução de Problemas

1. **Frontend não carrega**
   - Verifique se está rodando `npm run dev`
   - Confira o arquivo `.env`
   - Veja o console do navegador

2. **API não responde**
   - Verifique se a API está rodando
   - Confira a porta 3001
   - Veja os logs do servidor

3. **n8n não gera história**
   - Verifique a URL do webhook
   - Confira se o n8n está online
   - Teste o endpoint manualmente

4. **Design não aparece**
   - Limpe o cache do navegador
   - Verifique se o CSS carregou
   - Teste em outro navegador

## 🤝 Contribuindo

1. Faça um fork
2. Crie sua branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

MIT © Seu Nome
