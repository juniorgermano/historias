import { toast } from "@/hooks/use-toast";
import { Story, CreateStoryData } from "@/types/story";

// Usa caminhos relativos
const API_URL = '/api';
const N8N_URL = 'https://n8nwebhook.bikehousene.com.br/webhook/HISTORIAS';

export const api = {
  // Retorna todas as histórias
  async getStories(): Promise<Story[]> {
    const response = await fetch(`${API_URL}/stories`);
    return response.json();
  },

  // Busca uma história pelo ID
  async getStory(id: string): Promise<Story> {
    console.log('Buscando história:', id);
    const response = await fetch(`${API_URL}/stories/${id}`);
    const story = await response.json();
    console.log('História encontrada:', story);
    
    if (!story) throw new Error('História não encontrada');
    return story;
  },

  // Cria uma nova história
  async saveStory(data: CreateStoryData): Promise<Story> {
    try {
      // Gera história via n8n
      const n8nResponse = await fetch(N8N_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          data: {
            child_name: data.name,
            story_type: data.type,
            details: data.details
          }
        })
      });

      if (!n8nResponse.ok) throw new Error('Erro ao gerar história');
      const result = await n8nResponse.json();

      // Cria nova história
      const story: Story = {
        id: Date.now().toString(),
        title: result.title,
        text: result.text,
        votes: 0,
        audioUrl: result.audioUrl || null,
        imageUrl: result.imageUrl || null,
        createdAt: new Date().toISOString()
      };

      // Salva no servidor
      const saveResponse = await fetch(`${API_URL}/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(story)
      });

      if (!saveResponse.ok) throw new Error('Erro ao salvar história');
      return saveResponse.json();

    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro ao criar história",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Atualiza os votos de uma história
  async voteStory(id: string, vote: 1 | -1): Promise<Story> {
    const response = await fetch(`${API_URL}/stories/${id}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ vote })
    });

    if (!response.ok) throw new Error('Erro ao votar');
    return response.json();
  }
}; 