import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { StoryResult } from "./StoryResult";
import { StoryCard } from "./StoryCard";
import { Input } from "./ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Story {
  id: string;
  title: string;
  text: string;
  votes: number;
  audioUrl?: string;
  createdAt: string;
}

export function StoryList() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 10;

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const response = await fetch('/api/stories');
      return response.json();
    }
  });

  const voteMutation = useMutation({
    mutationFn: ({ id, vote }: { id: string; vote: 1 | -1 }) => api.voteStory(id, vote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    }
  });

  // Se uma história está selecionada, mostra ela no StoryResult
  if (selectedStory) {
    return (
      <StoryResult
        title={selectedStory.title}
        text={selectedStory.text}
        audioUrl={selectedStory.audioUrl}
        onBack={() => setSelectedStory(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-text-soft">
        Carregando histórias...
      </div>
    );
  }

  if (!stories?.length) {
    return (
      <div className="text-center text-text-soft">
        Nenhuma história encontrada
      </div>
    );
  }

  // Filtra e ordena as histórias
  const filteredAndSortedStories = stories
    .filter(story => 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.votes - a.votes);

  // Calcula o total de páginas
  const totalPages = Math.ceil(filteredAndSortedStories.length / storiesPerPage);

  // Obtém as histórias da página atual
  const currentStories = filteredAndSortedStories.slice(
    (currentPage - 1) * storiesPerPage,
    currentPage * storiesPerPage
  );

  // Reseta para primeira página quando pesquisar
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Barra de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Procurar histórias..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 w-full bg-white/50 backdrop-blur-sm"
        />
      </div>

      {/* Lista de histórias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentStories.map(story => (
          <StoryCard
            key={story.id}
            id={story.id}
            title={story.title}
            text={story.text}
            votes={story.votes}
            imageUrl={story.imageUrl}
          />
        ))}
      </div>

      {/* Mensagem quando não encontrar histórias */}
      {filteredAndSortedStories.length === 0 && (
        <p className="text-center text-muted-foreground">
          Nenhuma história encontrada com "{searchTerm}"
        </p>
      )}

      {/* Controles de paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="gap-1"
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
