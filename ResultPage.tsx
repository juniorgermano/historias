import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StoryResult } from "@/components/StoryResult";
import { StoryList } from "@/components/StoryList";
import { Button } from "@/components/ui/button";
import { Save, Share } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { Comments } from "@/components/Comments";

export function ResultPage() {
  const [saving, setSaving] = useState(false);
  const [savedStoryId, setSavedStoryId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { title, text, audioUrl, imageUrl } = location.state || {};
  
  if (!text) {
    return (
      <Layout>
        <div className="w-full max-w-2xl space-y-8">
          <h1 className="text-4xl font-bold text-center text-text">
            História não encontrada
          </h1>
          <p className="text-center text-text-soft">
            Volte para a página inicial e gere uma nova história.
          </p>
        </div>
      </Layout>
    );
  }

  async function handleSave() {
    try {
      setSaving(true);
      
      let authorName = "Anônimo";
      if (title) {
        const titleParts = title.split(" de ");
        authorName = titleParts.length > 1 ? titleParts[1].trim() : title.trim();
      }

      const story = await api.saveStory({
        name: authorName,
        type: "aventura",
        details: text
      });

      setSavedStoryId(story.id);

      toast({
        title: "História salva!",
        description: "Agora outros podem ler e votar nela."
      });

      setTimeout(() => {
        navigate(`/stories/${story.id}`);
      }, 100);

    } catch (error) {
      console.error("Erro ao salvar história:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a história",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <StoryResult
        title={title}
        text={text}
        audioUrl={audioUrl}
        imageUrl={imageUrl}
        onBack={() => navigate('/')}
        temporaryId={savedStoryId}
        showShare={false}
      />

      <div className="flex justify-center gap-2">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar História"}
        </Button>

        {savedStoryId && (
          <Button
            variant="ghost"
            onClick={() => {
              const url = `${window.location.origin}/stories/${savedStoryId}`;
              const shareText = `
🧚‍♀️ *${title || 'História Mágica'}* 🧚‍♀️

${text.slice(0, 200)}... 

📖 Leia a história completa em: ${url}

✨ Crie sua própria história mágica em: ${window.location.origin}
`.trim();

              window.open(
                `https://wa.me/?text=${encodeURIComponent(shareText)}`,
                '_blank'
              );
            }}
            className="text-green-600 hover:text-green-700 gap-2"
          >
            <Share className="h-4 w-4" />
            Compartilhar
          </Button>
        )}
      </div>

      {savedStoryId && (
        <Comments storyId={savedStoryId} />
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-text">
          Outras Histórias Mágicas
        </h2>
        <StoryList />
      </div>
    </Layout>
  );
} 