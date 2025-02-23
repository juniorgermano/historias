const fs = require('fs');
const path = require('path');

async function generateSitemap() {
  const stories = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../api/stories.json'), 'utf8')
  ).stories;

  const baseUrl = 'https://seu-dominio.com';
  const today = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${stories.map(story => `
  <url>
    <loc>${baseUrl}/stories/${story.id}</loc>
    <lastmod>${story.createdAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
</urlset>`;

  fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), xml);
}

generateSitemap(); 