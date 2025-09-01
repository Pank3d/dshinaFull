"use client";

import React from "react";
import Image from "next/image";
import style from "./ItemInBasket.module.scss";
import { BasketItem } from "../../types";
import { useBasketStore } from "../../BasketStore";
import { LoaderComponent } from "../../../../shared/ui/Loader/Loader";

interface ItemInBasketProps {
  item: BasketItem;
}

export const ItemInBasket: React.FC<ItemInBasketProps> = ({ item }) => {
  const { deleteBasketArray, isItemLoading } = useBasketStore();
  const isDeleting = isItemLoading(item.code);

  const deleteBasketArrayMethod = async () => {
    await deleteBasketArray(item.code);
  };

  const getPrice = () => {
    if (item.whpr?.wh_price_rest && item.whpr.wh_price_rest.length > 0) {
      return (
        item.whpr.wh_price_rest[0].price_rozn ||
        item.whpr.wh_price_rest[0].price
      );
    }
    return 0;
  };

  const getRest = () => {
    if (item.whpr?.wh_price_rest && item.whpr.wh_price_rest.length > 0) {
      return item.whpr.wh_price_rest[0].rest;
    }
    return 0;
  };

  return (
    <div className={style.itemContainer}>
      <div className={style.imageContainer}>
        {item.img_small && (
          <Image
            src={item.img_small}
            alt={item.name}
            width={80}
            height={80}
            className={style.itemImage}
          />
        )}
      </div>

      <div className={style.itemInfo}>
        <h4 className={style.itemName}>{item.name}</h4>
        <p className={style.itemDetails}>
          {item.marka} {item.model}
        </p>
        <p className={style.itemCode}>{item.code}</p>
        <p className={style.itemQuantity}>Количество: {item.quantity || 1} шт</p>
        <p className={style.itemRest}>{getRest()} шт в наличии</p>
      </div>

      <div className={style.priceSection}>
        <div className={style.price}>
          {(getPrice() * (item.quantity || 1)).toLocaleString()}р
          {item.quantity && item.quantity > 1 && (
            <small className={style.pricePerUnit}>
              ({getPrice().toLocaleString()}р за шт)
            </small>
          )}
        </div>
        <button
          className={`${style.deleteButton} ${isDeleting ? style.deleting : ""}`}
          onClick={() => deleteBasketArrayMethod()}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <LoaderComponent />
              Удаление...
            </>
          ) : (
            "Удалить"
          )}
        </button>
      </div>
    </div>
  );
};
