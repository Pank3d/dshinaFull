import React from "react";
import style from "./Header.module.scss";
import { BasketComponent } from "../../entities/basket/ui";
import Image from "next/image";

export const Header = () => {
  return (
    <header className={style.headerWrapper}>
      <div className={style.logoImage}>Dmshina</div>
      <div className={style.basketImageContainer}>
        <BasketComponent />
      </div>
    </header>
  );
};
