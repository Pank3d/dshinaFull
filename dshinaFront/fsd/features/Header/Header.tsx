import React from "react";
import style from "./Header.module.scss";
import { BasketComponent } from "../../entities/basket/ui";

export const Header = () => {
  return (
    <header className={style.headerWrapper}>
      <div className={style.logoImage}>Тут будет логотип</div>
      <div className={style.basketImageContainer}>
        <BasketComponent />
      </div>
    </header>
  );
};
