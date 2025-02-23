import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { api } from "@/services/api";

interface StoryVoteProps {
  storyId: string;
  initialVotes: number;
  onVote?: () => void;
}

export function StoryVote({ storyId, initialVotes, onVote }: StoryVoteProps) {
  const [votes, setVotes] = useState(initialVotes);

  async function handleVote(value: 1 | -1) {
    try {
      await api.voteStory(storyId, value);
      setVotes(prev => prev + value);
      onVote?.();
    } catch (error) {
      console.error("Erro ao votar:", error);
      alert("Erro ao registrar voto. Tente novamente.");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote(1)}
        className="text-green-600 hover:text-green-700 transition-colors"
        title="Gostei"
      >
        <ThumbsUp className="h-5 w-5" />
      </button>

      <span className="text-sm font-medium text-text">
        {votes}
      </span>

      <button
        onClick={() => handleVote(-1)}
        className="text-red-600 hover:text-red-700 transition-colors"
        title="Não Gostei"
      >
        <ThumbsDown className="h-5 w-5" />
      </button>
    </div>
  );
} 