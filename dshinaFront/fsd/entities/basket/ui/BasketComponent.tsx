"use client";
import React, { useState } from "react";
import style from "./BasketComponent.module.scss";
import Image from "next/image";
import basketImage from "../../../shared/assets/BasketImage.svg";
import { ModalComponent } from "../../../shared/ui/Modal/ModalComponent";
import { useBasketStore } from "../BasketStore";
import { ItemInBasket } from "./ItemInBasket/ItemInBasket";
import { useSendOrderToTelegram } from "../../markiAvto/api/query";
import { OrderForm } from "./OrderForm/OrderForm";
import { SuccessModal } from "../../../shared/ui/SuccessModal/SuccessModal";

export const BasketComponent = () => {
  const [opened, setOpened] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const store = useBasketStore();
  const itemCount = store.basketArray.length;
  const sendOrderMutation = useSendOrderToTelegram(
    () => {
      // onSuccess
      store.clearBasket();
      setShowOrderForm(false);
      setOpened(false);
      setShowSuccessModal(true);
    },
    (error: any) => {
      // onError
      alert("Ошибка при отправке заказа: " + error.message);
    }
  );

  const getTotalPrice = () => {
    return store.basketArray.reduce((total, item) => {
      if (item.whpr?.wh_price_rest && item.whpr.wh_price_rest.length > 0) {
        const price =
          item.whpr.wh_price_rest[0].price_rozn ||
          item.whpr.wh_price_rest[0].price;
        const quantity = item.quantity || 1;
        return total + price * quantity;
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

  const handleOrderClick = () => {
    if (store.basketArray.length === 0) return;
    setShowOrderForm(true);
  };

  const handleOrderSubmit = (contactData: {
    phone: string;
    telegram: string;
  }) => {
    const orderData = {
      customerName: "Клиент с сайта",
      email: "",
      phone: contactData.phone,
      telegram: contactData.telegram,
      items: store.basketArray.map((item) => ({
        name: item.name,
        code: item.code,
        price:
          item.whpr?.wh_price_rest?.[0]?.price_rozn ||
          item.whpr?.wh_price_rest?.[0]?.price ||
          0,
        quantity: item.quantity || 1,
        marka: item.marka,
        model: item.model,
      })),
      totalPrice: getTotalPrice(),
    };
    sendOrderMutation.mutate(orderData);
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
                <button
                  className={style.checkoutButton}
                  onClick={handleOrderClick}
                  disabled={sendOrderMutation.isPending}
                >
                  Оформить заказ
                </button>
              </div>
            </>
          )}
        </div>
      </ModalComponent>

      <ModalComponent
        opened={showOrderForm}
        close={() => setShowOrderForm(false)}
        title="Оформление заказа"
      >
        <OrderForm
          onSubmit={handleOrderSubmit}
          sendOrderMutation={sendOrderMutation}
        />
      </ModalComponent>

      <SuccessModal
        opened={showSuccessModal}
        close={() => setShowSuccessModal(false)}
      />
    </>
  );
};
