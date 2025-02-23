import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-primary-soft to-secondary-soft backdrop-blur-sm border-b border-white/20">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Link to="/" className="block text-center">
          <h1 className="title text-2xl md:text-3xl text-text animate-fadeIn">
            Histórias para Dormir
          </h1>
          <p className="text-text-soft text-sm md:text-base mt-1 animate-fadeIn">
            Crie Histórias Mágicas Personalizadas para Seu Filho!
          </p>
        </Link>
      </div>
    </header>
  );
} 