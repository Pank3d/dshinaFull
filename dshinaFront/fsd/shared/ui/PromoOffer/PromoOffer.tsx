import React from "react";
import style from "./PromoOffer.module.scss";

interface PromoOfferProps {
  className?: string;
}

export const PromoOffer: React.FC<PromoOfferProps> = ({ className }) => {
  return (
    <div className={`${style.promoContainer} ${className || ""}`}>
      <span className={style.text}>
        Получи <span className={style.highlight}>скидку 10%</span> за подписку
        на наш Telegram канал
      </span>
    </div>
  );
};
