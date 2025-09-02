import { NextResponse } from "next/server";

// Функция для получения всех товаров (нужно адаптировать под ваш API)
async function getAllProducts() {
  try {
    // Здесь должен быть вызов к вашему API для получения всех товаров
    // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/all`);
    // return response.json();
    return []; // Временная заглушка
  } catch {
    console.error("Error fetching products for sitemap:");
    return [];
  }
}

export async function GET() {
  const products = await getAllProducts();
  const baseUrl = "https://dmshina.ru";

  // Статические страницы
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Динамические страницы товаров
  const productPages = products.map((product: { code: string }) => ({
    url: `${baseUrl}/product/${product.code}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const allPages = [...staticPages, ...productPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
