"use client";

import React from "react";
import Link from "next/link";
import style from "./DeliveryBanner.module.scss";

interface DeliveryBannerProps {
  className?: string;
}

export const DeliveryBanner: React.FC<DeliveryBannerProps> = ({
  className,
}) => {
  return (
    <Link
      href="/delivery"
      className={`${style.bannerContainer} ${className || ""}`}
    >
      <div className={style.content}>
        <div className={style.section}>
          <span className={style.text}>
            <span className={style.highlight}>
              Бесплатная курьерская доставка
            </span>{" "}
            по Симферополю, Севастополю, Бахчисараю
          </span>
        </div>

        <div className={style.divider}></div>

        <div className={style.section}>
          <span className={style.text}>
            <span className={style.highlight}>Бесплатная доставка</span> во все
            города Крыма ТК
          </span>
        </div>

        <div className={style.divider}></div>

        <div className={style.section}>
          <span className={style.text}>
            Телефон: <span className={style.phone}>8 (978) 741-46-48</span>
          </span>
        </div>
      </div>
      <div className={style.moreInfo}>
        <span>Подробнее об условиях доставки →</span>
      </div>
    </Link>
  );
};
