"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import style from "./ProductDetailView.module.scss";
import { GoodsPriceRest } from "../../entities/markiAvto/api/types";
import { ButtonComponent } from "../../shared/ui/Button";
import { useBasketStore } from "../../entities/basket";
import { LoaderComponent } from "../../shared/ui/Loader/Loader";
import { useGetWarehouses } from "../../entities/markiAvto/api/query";

interface ProductDetailViewProps {
  product: GoodsPriceRest;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    product.img_big_my || product.img_small
  );
  const { data: dataWarehouses } = useGetWarehouses();
  const [alreadyAdded, setAlreadyAdded] = useState(false);

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

  const getWarehouseInfo = (warehouseId: number) => {
    return dataWarehouses?.find(
      (warehouse: any) => warehouse.id === warehouseId
    );
  };

  return (
    <div className={style.productDetail}>
      <div className={style.breadcrumb}>
        <button onClick={() => router.back()} className={style.backButton}>
          ← Назад к каталогу
        </button>
      </div>

      <div className={style.productContent}>
        <div className={style.imageSection}>
          <div className={style.mainImage}>
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.name}
                width={400}
                height={400}
                className={style.productImage}
              />
            ) : (
              <div className={style.noImage}>
                <span>Нет изображения</span>
              </div>
            )}
          </div>

          <div className={style.thumbnails}>
            {product.img_big_pish &&
              product.img_big_pish !== product.img_big_my && (
                <button
                  className={`${style.thumbnail} ${
                    selectedImage === product.img_big_pish ? style.active : ""
                  }`}
                  onClick={() => setSelectedImage(product.img_big_pish)}
                >
                  <Image
                    src={product.img_big_pish}
                    alt="Дополнительное фото"
                    width={80}
                    height={80}
                  />
                </button>
              )}
          </div>

          {product.whpr?.wh_price_rest &&
            product.whpr.wh_price_rest.length > 0 && (
              <div className={style.warehouseInfo}>
                <h4>Наличие на складах:</h4>
                <div className={style.warehouseList}>
                  {product.whpr.wh_price_rest
                    .filter((item) => item.rest > 0)
                    .map((item, index) => {
                      const warehouse = getWarehouseInfo(item.wrh);
                      console.log(warehouse)
                      return (
                        <div key={index} className={style.warehouseItem}>
                          <div className={style.warehouseName}>
                            {warehouse?.name || `Склад #${item.wrh}`}
                          </div>
                          <div className={style.warehouseDetails}>
                            <span className={style.warehouseStock}>
                              {item.rest} шт.
                            </span>
                            {warehouse?.logisticDays !== undefined && (
                              <span className={style.logistickDate}>
                                Поставка: {warehouse.logisticDays} дней
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
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
  );
};
