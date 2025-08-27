'use client'

import React from "react";
import Image from "next/image";
import style from "./ItemInBasket.module.scss";
import { GoodsPriceRest } from "../../../markiAvto/api/types";
import { useBasketStore } from "../../BasketStore";

interface ItemInBasketProps {
  item: GoodsPriceRest;
}

export const ItemInBasket: React.FC<ItemInBasketProps> = ({ item }) => {
  const { deleteBasketArray } = useBasketStore();
  
  const getPrice = () => {
    if (item.whpr?.wh_price_rest && item.whpr.wh_price_rest.length > 0) {
      return item.whpr.wh_price_rest[0].price_rozn || item.whpr.wh_price_rest[0].price;
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
        <p className={style.itemRest}>{getRest()} шт </p>
      </div>
      
      <div className={style.priceSection}>
        <div className={style.price}>{getPrice().toLocaleString()}р</div>
        <button 
          className={style.deleteButton}
          onClick={() => deleteBasketArray(Number(item.code))}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};