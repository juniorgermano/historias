import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { StoryVote } from "./StoryVote";

interface StoryCardProps {
  id: string;
  title: string;
  text: string;
  votes: number;
  imageUrl?: string | null;
  onVote?: () => void;
}

export function StoryCard({ id, title, text, votes, imageUrl, onVote }: StoryCardProps) {
  // Buscar comentários para esta história
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const response = await fetch(`/api/stories/${id}/comments`);
      return response.json();
    }
  });

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/stories/${id}`}>
        {imageUrl && (
          <div className="relative h-48 w-full">
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-story.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className="p-4 space-y-2">
          <h3 className="text-lg font-bold text-text line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-text-soft line-clamp-3">
            {text}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4 flex justify-between items-center">
        <StoryVote 
          storyId={id} 
          initialVotes={votes}
          onVote={onVote}
        />

        {/* Contador de comentários */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span>{comments.length}</span>
        </div>
      </div>
    </div>
  );
} 