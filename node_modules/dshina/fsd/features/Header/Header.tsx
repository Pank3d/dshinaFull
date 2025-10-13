import React from "react";
import style from "./Header.module.scss";
import { BasketComponent } from "../../entities/basket/ui";
import { socialLinksConfig } from "../../shared/config/socialLinksConfig";
import SocialLinksComponent  from "../../shared/ui/SocialLinks/SocialLinks";

export const Header = () => {
  return (
    <header className={style.headerWrapper}>
      <div className={style.logoImage}>Dmshina</div>
      <div className={style.centerSection}>
        <SocialLinksComponent
          links={socialLinksConfig}
          title="Связаться с нами:"
        />
      </div>
      <div className={style.basketImageContainer}>
        <BasketComponent />
      </div>
    </header>
  );
};
