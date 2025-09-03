"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import style from "./ProductDetailView.module.scss";
import { GoodsPriceRest } from "../../entities/markiAvto/api/types";
import { ButtonComponent } from "../../shared/ui/Button";
import { useBasketStore } from "../../entities/basket";
import { LoaderComponent } from "../../shared/ui/Loader/Loader";

interface ProductDetailViewProps {
  product: GoodsPriceRest;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [alreadyAdded, setAlreadyAdded] = useState(false);

  // Создаем массив изображений для слайдера
  const images = [product.img_big_pish].filter(Boolean); // Убираем пустые значения

  const store = useBasketStore();
  const router = useRouter();
  const isAddingToBasket = store.isItemLoading(product.code);

  useEffect(() => {
    if (store.isItemInBasket(product.code)) {
      setAlreadyAdded(true);
    }
  }, [store.basketArray, product.code]);

  const addToBasket = () => {
    store.setBasketArray(product);
  };

  const getPrice = () => {
    if (product.whpr?.wh_price_rest && product.whpr.wh_price_rest.length > 0) {
      return (
        product.whpr.wh_price_rest[0].price_rozn ||
        product.whpr.wh_price_rest[0].price
      );
    }
    return 0;
  };

  const getRest = () => {
    if (product.whpr?.wh_price_rest && product.whpr.wh_price_rest.length > 0) {
      const totalRest = product.whpr.wh_price_rest.reduce(
        (total, item) => total + item.rest,
        0
      );
      return totalRest;
    }
    return 0;
  };

  // Структурированные данные для товара
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: `Автомобильная шина ${product.marka} ${product.model}. ${product.type ? `Тип: ${product.type}.` : ""} ${product.color ? `Цвет: ${product.color}.` : ""} ${product.thorn ? "Шипованная." : "Нешипованная."}`,
    sku: product.code,
    mpn: product.code,
    brand: {
      "@type": "Brand",
      name: product.marka,
    },
    model: product.model,
    category: "Автомобильные шины",
    image: product.img_big_pish || "",
    offers: {
      "@type": "Offer",
      url: `https://dmshina.ru/product/${product.code}`,
      priceCurrency: "RUB",
      price: getPrice(),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 дней
      availability:
        getRest() > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "DSHINA.RU",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Марка",
        value: product.marka,
      },
      {
        "@type": "PropertyValue",
        name: "Модель",
        value: product.model,
      },
      {
        "@type": "PropertyValue",
        name: "Тип",
        value: product.type,
      },
      {
        "@type": "PropertyValue",
        name: "Цвет",
        value: product.color,
      },
      {
        "@type": "PropertyValue",
        name: "Шипованная",
        value: product.thorn ? "Да" : "Нет",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <div className={style.productDetail}>
        <div className={style.breadcrumb}>
          <button onClick={() => router.back()} className={style.backButton}>
            ← Назад к каталогу
          </button>
        </div>

        <div className={style.productContent}>
          <div className={style.imageSection}>
            {images.length > 0 ? (
              <>
                {/* Основной слайдер */}
                <Swiper
                  modules={[Navigation, Pagination, Thumbs]}
                  thumbs={{ swiper: thumbsSwiper }}
                  navigation={true}
                  pagination={{ clickable: true }}
                  className={style.mainSwiper}
                  spaceBetween={10}
                  slidesPerView={1}
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className={style.mainImage}>
                        <Image
                          src={image}
                          alt={`${product.name} - изображение ${index + 1}`}
                          width={400}
                          height={400}
                          className={style.productImage}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Миниатюры слайдер (если больше одного изображения) */}
                {images.length > 1 && (
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    className={style.thumbsSwiper}
                    modules={[Thumbs]}
                  >
                    {images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className={style.thumbnail}>
                          <Image
                            src={image}
                            alt={`Миниатюра ${index + 1}`}
                            width={80}
                            height={80}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </>
            ) : (
              <div className={style.noImage}>
                <span>Нет изображения</span>
              </div>
            )}
          </div>

          <div className={style.infoSection}>
            <h1 className={style.productTitle}>{product.name}</h1>

            <div className={style.productMeta}>
              <span className={style.productCode}>Артикул: {product.code}</span>
              <span
                className={`${style.availability} ${
                  getRest() > 0 ? style.inStock : style.outOfStock
                }`}
              >
                {getRest() > 0 ? `В наличии: ${getRest()} шт` : "Нет в наличии"}
              </span>
            </div>

            <div className={style.specifications}>
              <h3>Характеристики</h3>
              <div className={style.specGrid}>
                <div className={style.specItem}>
                  <span className={style.specLabel}>Марка:</span>
                  <span className={style.specValue}>{product.marka}</span>
                </div>
                <div className={style.specItem}>
                  <span className={style.specLabel}>Модель:</span>
                  <span className={style.specValue}>{product.model}</span>
                </div>
                <div className={style.specItem}>
                  <span className={style.specLabel}>Тип:</span>
                  <span className={style.specValue}>{product.type}</span>
                </div>
                <div className={style.specItem}>
                  <span className={style.specLabel}>Цвет:</span>
                  <span className={style.specValue}>{product.color}</span>
                </div>
                <div className={style.specItem}>
                  <span className={style.specLabel}>Шипованная:</span>
                  <span className={style.specValue}>
                    {product.thorn ? "Да" : "Нет"}
                  </span>
                </div>
              </div>
            </div>

            <div className={style.purchaseSection}>
              <div className={style.priceBlock}>
                <span className={style.price}>
                  {getPrice().toLocaleString()} ₽
                </span>
              </div>

              <div className={style.actions}>
                {isAddingToBasket ? (
                  <div className={style.loadingButton}>
                    <LoaderComponent />
                    <span>Добавление...</span>
                  </div>
                ) : !alreadyAdded ? (
                  <ButtonComponent
                    variant="filled"
                    text="Добавить в корзину"
                    onClick={addToBasket}
                    className={style.addToCartButton}
                    disabled={getRest() === 0}
                  />
                ) : (
                  <ButtonComponent
                    variant="filled"
                    text="Товар в корзине"
                    disabled
                    className={style.addedButton}
                  />
                )}
              </div>
            </div>

            <div className={style.description}>
              <h3>Описание</h3>
              <p>
                Высококачественная шина {product.marka} {product.model}{" "}
                обеспечивает отличное сцепление с дорогой и долговечность.
                Идеально подходит для различных дорожных условий и обеспечивает
                комфортную и безопасную езду.
              </p>
              <p>
                Современные технологии производства гарантируют высокую
                износостойкость и отличные характеристики управляемости
                автомобиля.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
