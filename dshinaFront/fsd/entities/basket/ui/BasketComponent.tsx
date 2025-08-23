"use client";
import React, { useState } from "react";
import style from "./BasketComponent.module.scss";
import Image from "next/image";
import basketImage from "../../../shared/assets/BasketImage.svg";
import { ModalComponent } from "../../../shared/ui/Modal/ModalComponent";
import { useBasketStore } from "../BasketStore";

export const BasketComponent = () => {
  const [opened, setOpened] = useState(false);
  const store = useBasketStore();
  console.log(store.basketArray);
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
      </div>
      <ModalComponent
        opened={opened}
        close={() => setOpened(false)}
        title="Корзина"
      >
        {store.basketArray.map((i) => {
          return <div key={i.code}>{i.code}</div>;
        })}
      </ModalComponent>
    </>
  );
};
