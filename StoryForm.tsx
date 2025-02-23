import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CreateStoryData } from "@/types/story";
import { Progress } from "./ui/progress";

export function StoryForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState<CreateStoryData>({
    name: "",
    type: "",
    details: ""
  });

  // Mensagens de status do progresso
  const statusMessages = [
    "Criando história...",
    "Inserindo o personagem...",
    "Criando imagem...",
    "Deixando a história divertida..."
  ];

  // Efeito para simular o progresso
  useEffect(() => {
    if (loading) {
      const duration = 46000; // 46 segundos
      const interval = duration / 100; // Divide em 100 partes
      const step = 100 / statusMessages.length; // Progresso por mensagem

      let currentProgress = 0;
      let messageIndex = 0;

      const timer = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);

        // Atualiza a mensagem baseado no progresso
        if (currentProgress >= step * (messageIndex + 1) && messageIndex < statusMessages.length - 1) {
          messageIndex++;
          setStatusMessage(statusMessages[messageIndex]);
        }

        if (currentProgress >= 100) {
          clearInterval(timer);
        }
      }, interval);

      // Define a mensagem inicial
      setStatusMessage(statusMessages[0]);

      return () => clearInterval(timer);
    } else {
      setProgress(0);
      setStatusMessage("");
    }
  }, [loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.details) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const result = await api.saveStory(formData);
      navigate("/result", { 
        state: { 
          title: result.title,
          text: result.text,
          audioUrl: result.audioUrl,
          imageUrl: result.imageUrl
        }
      });
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-text font-medium">
            Nome da Criança
          </label>
          <Input
            id="name"
            className="input"
            placeholder="Ex: João, Maria..."
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-text font-medium">
            Tipo de História
          </label>
          <select
            id="type"
            className="input w-full"
            value={formData.type}
            onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
            required
          >
            <option value="">Selecione o tipo de história</option>
            <option value="princesas">Princesas</option>
            <option value="aventuras">Aventuras na Floresta</option>
            <option value="herois">Super-Heróis</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="details" className="text-text font-medium">
            Detalhes Especiais
          </label>
          <Textarea
            id="details"
            className="textarea"
            placeholder="Ex: Com um dragão amigo, em um castelo mágico..."
            value={formData.details}
            onChange={e => setFormData(prev => ({ ...prev, details: e.target.value }))}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gerando História...
            </>
          ) : (
            'Gerar História Mágica'
          )}
        </button>

        {loading && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center text-muted-foreground animate-pulse">
              {statusMessage}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
