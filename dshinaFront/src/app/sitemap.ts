import { MetadataRoute } from "next";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  const baseUrl = "https://dmshina.ru";

  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Динамические страницы товаров
  const productPages: MetadataRoute.Sitemap = products.map(
    (product: { code: string }) => ({
      url: `${baseUrl}/product/${product.code}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...productPages];
}
