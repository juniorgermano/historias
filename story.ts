export interface Story {
  id: string;
  title: string;
  text: string;
  votes: number;
  audioUrl: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface CreateStoryData {
  name: string;
  type: string;
  details: string;
}

export interface StoryResponse {
  title: string;
  text: string;
  audioUrl: string | null;
  imageUrl: string | null;
} 