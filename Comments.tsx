import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ThumbsUp, ThumbsDown, Send, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  storyId: string;
  text: string;
  author: string;
  votes: number;
  createdAt: string;
}

interface CommentsProps {
  storyId: string;
}

export function Comments({ storyId }: CommentsProps) {
  const queryClient = useQueryClient();
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ['comments', storyId],
    queryFn: async () => {
      const response = await fetch(`/api/stories/${storyId}/comments`);
      return response.json();
    }
  });

  const addComment = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/stories/${storyId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao adicionar comentário');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
      setAuthor("");
      setText("");
      toast({
        title: "Comentário adicionado!",
        description: "Obrigado por compartilhar sua opinião."
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar comentário",
        description: "Não foi possível adicionar seu comentário. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const voteComment = useMutation({
    mutationFn: async ({ id, vote }: { id: string; vote: 1 | -1 }) => {
      const response = await fetch(`/api/comments/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao processar voto');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao votar",
        description: "Não foi possível processar seu voto. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="space-y-6 mt-8 bg-white/50 backdrop-blur-sm rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-text">Comentários</h3>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <MessageCircle className="h-4 w-4" />
          Deixar comentário
        </Button>
      </div>

      {isFormOpen && (
        <form 
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!author || !text) {
              toast({
                title: "Campos obrigatórios",
                description: "Preencha seu nome e o comentário",
                variant: "destructive"
              });
              return;
            }
            addComment.mutate();
            setIsFormOpen(false);
          }}
        >
          <Input
            placeholder="Seu nome"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="w-full"
          />

          <Textarea
            placeholder="Compartilhe sua opinião sobre a história..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            className="w-full"
          />

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={addComment.isPending}
              variant="primary"
              className="w-full mt-2"
            >
              <Send className="h-4 w-4 mr-2" />
              {addComment.isPending ? "Enviando..." : "Enviar Comentário"}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4 mt-8">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Seja o primeiro a comentar!
          </p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-card p-4 rounded-lg space-y-2 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-text">{comment.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => voteComment.mutate({ id: comment.id, vote: 1 })}
                    className="text-green-600 hover:text-green-700"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">{comment.votes}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => voteComment.mutate({ id: comment.id, vote: -1 })}
                    className="text-red-600 hover:text-red-700"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-text">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 