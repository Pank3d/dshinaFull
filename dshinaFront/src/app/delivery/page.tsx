import React from "react";
import { HeaderLayout } from "../../../fsd/widgets/HeaderLayout";
import style from "./delivery.module.scss";

export default function DeliveryPage() {
  return (
    <div>
      <HeaderLayout />

      <main className={style.deliveryPage}>
        <div className={style.container}>
          <h1 className={style.title}>Условия доставки</h1>

          <div className={style.content}>
            <section className={style.section}>
              <div className={style.iconWrapper}>
                <svg
                  className={style.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 7H16V6C16 4.34 14.66 3 13 3H11C9.34 3 8 4.34 8 6V7H5C3.9 7 3 7.9 3 9V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V9C21 7.9 20.1 7 19 7ZM10 6C10 5.45 10.45 5 11 5H13C13.55 5 14 5.45 14 6V7H10V6ZM19 20H5V9H19V20Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className={style.sectionTitle}>
                Бесплатная курьерская доставка
              </h2>
              <p className={style.text}>
                По городам:{" "}
                <span className={style.highlight}>
                  Симферополь, Севастополь, Бахчисарай
                </span>
              </p>
              <p className={style.subtext}>Оплата по факту получения</p>
            </section>

            <div className={style.divider}></div>

            <section className={style.section}>
              <div className={style.iconWrapper}>
                <svg
                  className={style.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 18.5C18.83 18.5 19.5 17.83 19.5 17C19.5 16.17 18.83 15.5 18 15.5C17.17 15.5 16.5 16.17 16.5 17C16.5 17.83 17.17 18.5 18 18.5ZM19.5 9.5H17V12H21.46L19.5 9.5ZM6 18.5C6.83 18.5 7.5 17.83 7.5 17C7.5 16.17 6.83 15.5 6 15.5C5.17 15.5 4.5 16.17 4.5 17C4.5 17.83 5.17 18.5 6 18.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M20 8H17V4H3C1.9 4 1 4.9 1 6V17H3C3 18.66 4.34 20 6 20C7.66 20 9 18.66 9 17H15C15 18.66 16.34 20 18 20C19.66 20 21 18.66 21 17H23V12L20 8Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className={style.sectionTitle}>
                Бесплатная доставка транспортной компанией
              </h2>
              <p className={style.text}>
                Во все города <span className={style.highlight}>Крыма</span>
              </p>
              <p className={style.subtext}>
                Отправляем от одного колеса бесплатно
              </p>
            </section>

            <div className={style.divider}></div>

            <section className={style.section}>
              <div className={style.iconWrapper}>
                <svg
                  className={style.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className={style.sectionTitle}>Контакты</h2>
              <p className={style.text}>Телефон для связи:</p>
              <a href="tel:+79787414648" className={style.phone}>
                8 (978) 741-46-48
              </a>
              <p className={style.subtext}>Звоните с 9:00 до 20:00</p>
            </section>
          </div>

          <div className={style.infoBox}>
            <h3 className={style.infoTitle}>Дополнительная информация</h3>
            <ul className={style.infoList}>
              <li>Доставка осуществляется в течение 1-3 рабочих дней</li>
              <li>При заказе от 4-х колёс - скидка 5%</li>
              <li>Проверка товара при получении</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
