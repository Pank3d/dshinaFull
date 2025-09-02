import { Metadata } from "next";
import { GoodsPriceRest } from "../../../../fsd/entities/markiAvto/api/types";

// Функция для получения товара (заглушка, нужно адаптировать под ваш API)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getProduct(_code: string): Promise<GoodsPriceRest | null> {
  try {
    // Здесь должен быть реальный API вызов
    // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${code}`);
    // if (!response.ok) return null;
    // return response.json();
    return null; // Временная заглушка
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  const product = await getProduct(params.code);

  if (!product) {
    return {
      title: "Товар не найден | DSHINA.RU",
      description: "Запрашиваемый товар не найден",
    };
  }

  const price =
    product.whpr?.wh_price_rest?.[0]?.price_rozn ||
    product.whpr?.wh_price_rest?.[0]?.price ||
    0;

  const totalRest =
    product.whpr?.wh_price_rest?.reduce(
      (total, item) => total + item.rest,
      0
    ) || 0;

  return {
    title: `${product.name} ${product.marka} ${product.model} - Купить по цене ${price.toLocaleString()}₽ | DSHINA.RU`,
    description: `${product.name} ${product.marka} ${product.model}. Артикул: ${product.code}. Цена: ${price.toLocaleString()}₽. ${totalRest > 0 ? `В наличии ${totalRest} шт.` : "Под заказ"}. Быстрая доставка.`,
    keywords: [
      product.name,
      product.marka,
      product.model,
      product.type,
      "шины",
      "автошины",
      product.code,
      `${product.marka} ${product.model}`,
    ],
    openGraph: {
      title: `${product.name} - ${product.marka} ${product.model}`,
      description: `Купить ${product.name} по цене ${price.toLocaleString()}₽. ${totalRest > 0 ? "В наличии" : "Под заказ"}.`,
      url: `https://dmshina.ru/product/${product.code}`,
      siteName: "DSHINA.RU",
      images: product.img_big_pish
        ? [
            {
              url: product.img_big_pish,
              width: 800,
              height: 800,
              alt: `${product.name} ${product.marka} ${product.model}`,
            },
          ]
        : [],
      locale: "ru_RU",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - ${product.marka} ${product.model}`,
      description: `Купить ${product.name} по цене ${price.toLocaleString()}₽`,
      images: product.img_big_pish ? [product.img_big_pish] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
