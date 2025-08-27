"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import style from "./ProductCard.module.scss";
import { GoodsPriceRest } from "../../entities/markiAvto/api/types";
import { ButtonComponent } from "../../shared/ui/Button";
import { useBasketStore } from "../../entities/basket";
import { LoaderComponent } from "../../shared/ui/Loader/Loader";

export const ProductCard = ({ dataItem }: { dataItem: GoodsPriceRest }) => {
  const store = useBasketStore();
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const isLoading = store.isItemLoading(dataItem.code);

  useEffect(() => {
    if (store.isItemInBasket(dataItem.code)) {
      setAlreadyAdded(true);
    }
  }, [store.basketArray]);

  const addToBasket = (dataItem: GoodsPriceRest) => {
    store.setBasketArray(dataItem);
  };

  const getPrice = () => {
    if (dataItem.whpr?.wh_price_rest && dataItem.whpr.wh_price_rest.length > 0) {
      return dataItem.whpr.wh_price_rest[0].price_rozn || dataItem.whpr.wh_price_rest[0].price;
    }
    return 0;
  };

  const getRest = () => {
    if (dataItem.whpr?.wh_price_rest && dataItem.whpr.wh_price_rest.length > 0) {
      return dataItem.whpr.wh_price_rest[0].rest;
    }
    return 0;
  };

  return (
    <div className={style.productCard}>
      <div className={style.imageContainer}>
        {dataItem.img_small && (
          <Image
            src={dataItem.img_small}
            alt={dataItem.name}
            width={120}
            height={120}
            className={style.productImage}
          />
        )}
      </div>
      
      <div className={style.productInfo}>
        <h4 className={style.productName}>{dataItem.name}</h4>
        <p className={style.productDetails}>
          {dataItem.marka} {dataItem.model}
        </p>
        <p className={style.productCode}>Код: {dataItem.code}</p>
        <p className={style.productRest}>{getRest()} шт в наличии</p>
      </div>
      
      <div className={style.actionSection}>
        <div className={style.price}>{getPrice().toLocaleString()}р</div>
        {isLoading ? (
          <div className={style.loadingButton}>
            <LoaderComponent />
            <span>Добавление...</span>
          </div>
        ) : !alreadyAdded ? (
          <ButtonComponent
            variant="filled"
            text="В корзину"
            onClick={() => addToBasket(dataItem)}
            className={style.addButton}
          />
        ) : (
          <ButtonComponent 
            variant="filled" 
            text="Добавлено" 
            disabled 
            className={style.addedButton}
          />
        )}
      </div>
    </div>
  );
};
