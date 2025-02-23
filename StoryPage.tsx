import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Volume2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { StoryResult } from "@/components/StoryResult";
import { StoryList } from "@/components/StoryList";
import { Layout } from "@/components/Layout";
import { Comments } from "@/components/Comments";
import { SEO } from "@/components/SEO";

export function StoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: story, isLoading } = useQuery({
    queryKey: ['story', id],
    queryFn: async () => {
      const story = await api.getStory(id!);
      console.log('História carregada:', story); // Debug
      return story;
    }
  });

  const voteMutation = useMutation({
    mutationFn: ({ vote }: { vote: 1 | -1 }) => api.voteStory(id!, vote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story', id] });
    }
  });

  async function playAudio() {
    if (!story?.audioUrl) {
      toast({
        title: "Áudio não disponível",
        variant: "destructive"
      });
      return;
    }

    try {
      const audio = new Audio(story.audioUrl);
      await audio.play();
    } catch (error) {
      toast({
        title: "Erro ao reproduzir áudio",
        variant: "destructive"
      });
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center">Carregando história...</div>
      </Layout>
    );
  }

  if (!story) {
    return (
      <Layout>
        <div className="text-center">História não encontrada</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={`${story?.title || 'História'} - Histórias Mágicas`}
        description={story?.text?.slice(0, 160)}
        image={story?.imageUrl}
      />
      <div className="container mx-auto px-4 py-8">
        <StoryResult
          id={id}
          title={story.title}
          text={story.text}
          votes={story.votes}
          audioUrl={story.audioUrl}
          imageUrl={story.imageUrl}
          onBack={() => navigate('/')}
        />

        {id && <Comments storyId={id} />}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-text">
            Outras Histórias Mágicas
          </h2>
          <StoryList />
        </div>
      </div>
    </Layout>
  );
} 