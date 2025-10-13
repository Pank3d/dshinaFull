import React from "react";
import { PromoOffer } from "../../shared/ui/PromoOffer/PromoOffer";
import { NavBar } from "../../features/NavBar";
import { Header } from "../../features/Header/Header";
import style from "./HeaderLayout.module.scss";

export const HeaderLayout = () => {
  return (
    <div className={style.headerLayoutWrapper}>
      <PromoOffer />
      <NavBar />  
      <Header />
    </div>
  );
};
