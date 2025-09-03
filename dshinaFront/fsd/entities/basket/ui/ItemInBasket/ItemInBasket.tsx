"use client";

import React, { useState } from "react";
import Image from "next/image";
import style from "./ItemInBasket.module.scss";
import { BasketItem } from "../../types";
import { useBasketStore } from "../../BasketStore";
import { LoaderComponent } from "../../../../shared/ui/Loader/Loader";
import { ImageWithoutWatermark } from "../../../../shared/ui/ImageWithoutWatermark";
import {
  getPriceWithMarkup,
  getTotalRest,
} from "../../../../shared/utils/priceUtils";

interface ItemInBasketProps {
  item: BasketItem;
}

export const ItemInBasket: React.FC<ItemInBasketProps> = ({ item }) => {
  const { deleteBasketArray, isItemLoading, updateQuantity } = useBasketStore();
  const isDeleting = isItemLoading(item.code);
  const [isEditingQuantity, setIsEditingQuantity] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(item.quantity || 1);

  const deleteBasketArrayMethod = async () => {
    await deleteBasketArray(item.code);
  };

  const getPrice = () => {
    return getPriceWithMarkup(item);
  };

  const getRest = () => {
    return getTotalRest(item);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0 || newQuantity > getRest()) return;

    const success = updateQuantity(item.code, newQuantity);
    if (success) {
      setTempQuantity(newQuantity);
    }
  };

  const handleQuantityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value) || 1;
    setTempQuantity(value);
  };

  const handleQuantitySubmit = () => {
    if (tempQuantity <= 0 || tempQuantity > getRest()) {
      setTempQuantity(item.quantity || 1);
    } else {
      updateQuantity(item.code, tempQuantity);
    }
    setIsEditingQuantity(false);
  };

  const handleQuantityCancel = () => {
    setTempQuantity(item.quantity || 1);
    setIsEditingQuantity(false);
  };

  return (
    <div className={style.itemContainer}>
      <div className={style.imageContainer}>
        <ImageWithoutWatermark
          imgBigMy={item.img_big_my}
          imgBigPish={item.img_big_pish}
          imgSmall={item.img_small}
          alt={item.name}
          width={80}
          height={80}
          className={style.itemImage}
          useSmallImage={true}
        />
      </div>

      <div className={style.itemInfo}>
        <h4 className={style.itemName}>{item.name}</h4>
        <p className={style.itemDetails}>
          {item.marka} {item.model}
        </p>
        <p className={style.itemCode}>{item.code}</p>
        <div className={style.quantitySection}>
          {isEditingQuantity ? (
            <div className={style.quantityEdit}>
              <input
                type="number"
                value={tempQuantity}
                onChange={handleQuantityInputChange}
                min={1}
                max={getRest()}
                className={style.quantityInput}
              />
              <div className={style.quantityButtons}>
                <button
                  onClick={handleQuantitySubmit}
                  className={style.quantityConfirm}
                >
                  ✓
                </button>
                <button
                  onClick={handleQuantityCancel}
                  className={style.quantityCancel}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className={style.quantityDisplay}>
              <div className={style.quantityControls}>
                <button
                  onClick={() => handleQuantityChange((item.quantity || 1) - 1)}
                  disabled={(item.quantity || 1) <= 1}
                  className={style.quantityBtn}
                >
                  −
                </button>
                <span
                  onClick={() => setIsEditingQuantity(true)}
                  className={style.quantityValue}
                  title="Нажмите для редактирования"
                >
                  {item.quantity || 1} шт
                </span>
                <button
                  onClick={() => handleQuantityChange((item.quantity || 1) + 1)}
                  disabled={(item.quantity || 1) >= getRest()}
                  className={style.quantityBtn}
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
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
