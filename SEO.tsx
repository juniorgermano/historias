interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({ 
  title = "Histórias Mágicas - Crie e Compartilhe Histórias Infantis",
  description = "Crie histórias infantis mágicas com IA. Uma ferramenta gratuita para pais, professores e crianças criarem contos encantadores.",
  image = "/og-image.jpg",
  url = window.location.href
}: SEOProps) {
  
  // Atualiza o título da página
  document.title = title;

  // Atualiza meta tags
  const metaTags = {
    description,
    "og:title": title,
    "og:description": description,
    "og:image": image,
    "og:url": url,
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": image,
    "twitter:url": url,
  };

  Object.entries(metaTags).forEach(([name, content]) => {
    const selector = `meta[property="${name}"]`;
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute("content", content);
    }
  });

  return null;
} 