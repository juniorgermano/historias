import { StoryForm } from "@/components/StoryForm";
import { StoryList } from "@/components/StoryList";
import { Layout } from "@/components/Layout";

export default function Index() {
  return (
    <Layout>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-text">
          Crie Histórias Mágicas Personalizadas para Seu Filho!
        </h1>
        <p className="text-lg text-text-soft">
          Cada história é única, criada com Inteligência Artificial especialmente 
          para sua criança, com amor e criatividade!
        </p>
        <p className="text-md text-text-soft px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
          Descubra histórias mágicas feitas sob medida!
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto">
        <StoryForm />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-text">
          Histórias Mágicas Criadas por Nossos Amigos!
        </h2>
        <StoryList />
      </div>
    </Layout>
  );
}
