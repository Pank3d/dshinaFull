import React from "react";
import style from "./ProductList.module.scss";
import {  GoodsPriceRest } from "../../entities/markiAvto/api/types";
import { ProductCard } from "../ProductCard";

export const ProductList = ({ data }: { data: GoodsPriceRest[] }) => {
  return (
    <main className={style.productMainWrapper}>
      {data.map((i) => {
        return <ProductCard dataItem={i} key={i.code} />;
      })}
    </main>
  );
};
