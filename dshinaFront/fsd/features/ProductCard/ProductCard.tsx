"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import style from "./ProductCard.module.scss";
import { GoodsPriceRest } from "../../entities/markiAvto/api/types";
import { ButtonComponent } from "../../shared/ui/Button";
import { useBasketStore } from "../../entities/basket";

export const ProductCard = ({ dataItem }: { dataItem: GoodsPriceRest }) => {
  const store = useBasketStore();
  const [alreadyAdded, setAlreadyAdded] = useState(false);

  useEffect(() => {
    if (store.isItemInBasket(dataItem.code)) {
      setAlreadyAdded(true);
    }
  }, [store.basketArray]);

  const addToBasket = (dataItem: GoodsPriceRest) => {
    store.setBasketArray(dataItem);
  };

  return (
    <div className={style.productCardWrapper}>
      <div className={style.imageContainer}>
        <Image src={dataItem.img_small} alt={""} width={200} height={200} />
      </div>
      <div className={style.textContainer}>
        <p>Название: {dataItem.name}</p>
        <p>Марка: {dataItem.marka}</p>
        <p>Модель: {dataItem.model}</p>
        <p>Код: {dataItem.code}</p>
        <p>Цена: {dataItem.whpr.wh_price_rest[0].price}р</p>
      </div>
      {!alreadyAdded ? (
        <ButtonComponent
          variant="filled"
          text="Добавить в корзину"
          onClick={() => addToBasket(dataItem)}
        />
      ) : (
        <ButtonComponent variant="filled" text="Уже добавлено" disabled />
      )}
    </div>
  );
};
