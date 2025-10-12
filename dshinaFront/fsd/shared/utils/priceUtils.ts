// Константа наценки по умолчанию
export const MARKUP_PERCENTAGE = 9;

/**
 * Определяет процент наценки в зависимости от диаметра шины
 * @param diameter - диаметр шины (R13, R14, R15 и т.д.)
 * @returns процент наценки
 */
export const getMarkupPercentage = (diameter?: number): number => {
  if (!diameter) return MARKUP_PERCENTAGE;

  if (diameter >= 13 && diameter <= 16) {
    return 5; // 5% для R13-R16
  }

  if (diameter >= 22) {
    return 7; // 7% для R22 и выше
  }

  return MARKUP_PERCENTAGE; // 9% для остальных (R17-R21)
};

/**
 * Извлекает диаметр из названия шины
 * @param name - название шины (например, "195/65R15 91H")
 * @returns диаметр шины или undefined
 */
export const extractDiameter = (name?: string): number | undefined => {
  if (!name) return undefined;

  // Парсим диаметр из строки типа "195/65R15" или "255/40ZR19"
  const match = name.match(/\d+\/\d+[A-Z]*R(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }

  return undefined;
};

/**
 * Применяет наценку к цене
 * @param price - исходная цена
 * @param markupPercent - процент наценки (по умолчанию 9%)
 * @returns цена с наценкой, округленная до целых
 */
export const applyMarkup = (
  price: number,
  markupPercent: number = MARKUP_PERCENTAGE
): number => {
  if (!price || price <= 0) return 0;

  const markup = price * (markupPercent / 100);
  const finalPrice = price + markup;

  // Округляем до целых
  return Math.round(finalPrice);
};

/**
 * Получает цену с наценкой из объекта товара
 * @param item - товар с ценовой информацией
 * @returns цена с наценкой
 */
export const getPriceWithMarkup = (item: any): number => {
  if (!item?.whpr?.wh_price_rest || item.whpr.wh_price_rest.length === 0) {
    return 0;
  }

  const basePrice = item.whpr.wh_price_rest[0].price;

  // Извлекаем диаметр из названия товара
  const diameter = extractDiameter(item.name);

  // Определяем процент наценки в зависимости от диаметра
  const markupPercent = getMarkupPercentage(diameter);

  return applyMarkup(basePrice, markupPercent);
};

/**
 * Получает общий остаток товара на складе
 * @param item - товар с информацией об остатках
 * @returns общее количество на складе
 */
export const getTotalRest = (item: any): number => {
  if (!item?.whpr?.wh_price_rest || item.whpr.wh_price_rest.length === 0) {
    return 0;
  }

  return item.whpr.wh_price_rest.reduce(
    (total: number, stock: any) => total + stock.rest,
    0
  );
};

/**
 * Получает русское название сезона
 * @param season - сезон на английском
 * @returns русское название сезона
 */
export const getSeasonDisplayName = (season?: string): string => {
  if (!season) return "";

  const seasonMap: Record<string, string> = {
    summer: "Летние",
    winter: "Зимние",
    "all-season": "Всесезонные",
    all_season: "Всесезонные",
    s: "Летние",
    w: "Зимние",
    a: "Всесезонные",
  };

  return seasonMap[season.toLowerCase()] || season;
};
