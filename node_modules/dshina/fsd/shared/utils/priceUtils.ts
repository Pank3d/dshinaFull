// Константа наценки
export const MARKUP_PERCENTAGE = 9;

/**
 * Применяет наценку к цене
 * @param price - исходная цена
 * @param markupPercent - процент наценки (по умолчанию 9%)
 * @returns цена с наценкой, округленная до целых
 */
export const applyMarkup = (price: number, markupPercent: number = MARKUP_PERCENTAGE): number => {
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
  
  const basePrice = item.whpr.wh_price_rest[0].price_rozn || item.whpr.wh_price_rest[0].price || 0;
  return applyMarkup(basePrice);
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
  
  return item.whpr.wh_price_rest.reduce((total: number, stock: any) => total + stock.rest, 0);
};