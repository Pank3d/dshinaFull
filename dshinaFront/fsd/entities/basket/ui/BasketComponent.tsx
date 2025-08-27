"use client";
import React, { useState } from "react";
import style from "./BasketComponent.module.scss";
import Image from "next/image";
import basketImage from "../../../shared/assets/BasketImage.svg";
import { ModalComponent } from "../../../shared/ui/Modal/ModalComponent";
import { useBasketStore } from "../BasketStore";
import { ItemInBasket } from "./ItemInBasket/ItemInBasket";

export const BasketComponent = () => {
  const [opened, setOpened] = useState(false);
  const store = useBasketStore();
  const itemCount = store.basketArray.length;

  const getTotalPrice = () => {
    return store.basketArray.reduce((total, item) => {
      if (item.whpr?.wh_price_rest && item.whpr.wh_price_rest.length > 0) {
        const price =
          item.whpr.wh_price_rest[0].price_rozn ||
          item.whpr.wh_price_rest[0].price;
        return total + price;
      }
      return total;
    }, 0);
  };

  const getMinDeliveryTime = () => {
    if (store.basketArray.length === 0) return 0;

    // Находим максимальное время доставки среди всех товаров
    const maxTime = store.basketArray.reduce((max, item) => {
      // Предполагаем, что время доставки зависит от остатков на складе
      // Если товар есть в наличии - 1-2 дня, если нет - 3-7 дней
      if (item.whpr?.wh_price_rest && item.whpr.wh_price_rest.length > 0) {
        const rest = item.whpr.wh_price_rest[0].rest;
        const deliveryDays = rest > 0 ? 2 : 7; // 2 дня если в наличии, 7 если под заказ
        return Math.max(max, deliveryDays);
      }
      return Math.max(max, 7); // По умолчанию 7 дней
    }, 0);

    return maxTime;
  };

  return (
    <>
      <div className={style.basketImageContainer}>
        <Image
          src={basketImage}
          alt="basket"
          height={50}
          width={50}
          onClick={() => setOpened(true)}
        />
        {itemCount > 0 && <div className={style.itemCount}>{itemCount}</div>}
      </div>
      <ModalComponent
        opened={opened}
        close={() => setOpened(false)}
        title="Корзина"
      >
        <div className={style.basketContent}>
          {store.basketArray.length === 0 ? (
            <div className={style.emptyBasket}>
              <p>Корзина пуста</p>
            </div>
          ) : (
            <>
              <div className={style.basketItems}>
                {store.basketArray.map((item) => (
                  <ItemInBasket key={item.code} item={item} />
                ))}
              </div>
              <div className={style.basketFooter}>
                <div className={style.deliveryInfo}>
                  <span className={style.deliveryTime}>
                    ⏱️ Срок доставки: {getMinDeliveryTime()}{" "}
                    {getMinDeliveryTime() === 1
                      ? "день"
                      : getMinDeliveryTime() < 5
                      ? "дня"
                      : "дней"}
                  </span>
                </div>
                <div className={style.totalPrice}>
                  <strong>
                    Общая стоимость: {getTotalPrice().toLocaleString()} ₽
                  </strong>
                </div>
                <button className={style.checkoutButton}>Оформить заказ</button>
              </div>
            </>
          )}
        </div>
      </ModalComponent>
    </>
  );
};
