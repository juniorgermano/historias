import { Button } from "./ui/button";
import { Volume2, ArrowLeft, Share } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { StoryVote } from "./StoryVote";

interface StoryResultProps {
  id?: string;
  title?: string;
  text: string;
  audioUrl?: string | null;
  imageUrl?: string | null;
  votes?: number;
  onBack: () => void;
  onVote?: () => void;
  temporaryId?: string | null;
  shareUrl?: string | null;
  showShare?: boolean;
}

export function StoryResult({ 
  id, 
  title, 
  text = "",
  audioUrl, 
  imageUrl, 
  votes = 0,
  onBack,
  onVote,
  temporaryId,
  shareUrl,
  showShare = true
}: StoryResultProps) {
  console.log('Props recebidas:', { id, title, text, audioUrl, imageUrl, votes });

  async function playAudio() {
    if (!audioUrl) {
      toast({
        title: "Áudio não disponível",
        variant: "destructive"
      });
      return;
    }

    try {
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      toast({
        title: "Erro ao reproduzir áudio",
        variant: "destructive"
      });
    }
  }

  function shareOnWhatsApp() {
    const storyId = id || temporaryId;
    const storyUrl = storyId 
      ? `${window.location.origin}/stories/${storyId}`
      : window.location.href;

    const shareText = `
🧚‍♀️ *${title || 'História Mágica'}* 🧚‍♀️

${text.slice(0, 200)}... 

📖 Leia a história completa em: ${storyUrl}

✨ Crie sua própria história mágica em: ${window.location.origin}
`.trim();

    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      '_blank'
    );
  }

  // Log para debug da URL da imagem
  console.log('URL da imagem:', imageUrl);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {audioUrl && (
          <Button 
            variant="ghost"
            onClick={playAudio}
            className="text-blue-600 hover:text-blue-700 gap-2"
          >
            <Volume2 className="h-4 w-4" />
            Ouvir História
          </Button>
        )}
      </div>

      {showShare && (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={shareOnWhatsApp}
            className="text-green-600 hover:text-green-700 gap-2"
          >
            <Share className="h-4 w-4" />
            Compartilhar
          </Button>
        </div>
      )}

      {imageUrl && (
        <div className="relative w-full h-[300px] rounded-xl overflow-hidden shadow-lg">
          <img 
            src={imageUrl} 
            alt={title || "Imagem da história"}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              console.error('Erro ao carregar imagem:', imageUrl);
              e.currentTarget.src = '/placeholder-story.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          {title && (
            <h2 className="text-2xl font-bold text-text">
              {title}
            </h2>
          )}

          {id && (
            <StoryVote 
              storyId={id} 
              initialVotes={votes}
              onVote={onVote}
            />
          )}
        </div>

        <div className="prose prose-sm max-w-none">
          {text?.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
