"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import style from "./ProductCard.module.scss";
import { GoodsPriceRest } from "../../entities/markiAvto/api/types";
import { ButtonComponent } from "../../shared/ui/Button";
import { useBasketStore } from "../../entities/basket";
import { LoaderComponent } from "../../shared/ui/Loader/Loader";
import { ModalComponent } from "../../shared/ui/Modal/ModalComponent";
import { AddQuantityModal } from "../../shared/ui/AddQuantityModal";
import { ImageWithoutWatermark } from "../../shared/ui/ImageWithoutWatermark";
import {
  getPriceWithMarkup,
  getTotalRest,
  getSeasonDisplayName,
} from "../../shared/utils/priceUtils";

export const ProductCard = ({ dataItem }: { dataItem: GoodsPriceRest }) => {
  const store = useBasketStore();
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isLoading = store.isItemLoading(dataItem.code);

  useEffect(() => {
    if (store.isItemInBasket(dataItem.code)) {
      setAlreadyAdded(true);
    }
  }, [store.basketArray]);

  const addToBasket = (dataItem: GoodsPriceRest, quantity: number = 1) => {
    const success = store.setBasketArray(dataItem, quantity);
    if (!success) {
      setErrorMessage(
        "Не удалось добавить товар: недостаточно количества в наличии"
      );
      setShowErrorModal(true);
    }
    return success;
  };

  const handleQuantitySubmit = (values: { quantity: number }) => {
    const success = addToBasket(dataItem, values.quantity);
    if (success) {
      setShowQuantityModal(false);
    }
  };

  const handleAddToBasketClick = () => {
    const availableQuantity = getAvailableQuantity();
    if (availableQuantity <= 0) {
      setErrorMessage(
        "Товар отсутствует в наличии или уже добавлен в максимальном количестве"
      );
      setShowErrorModal(true);
      return;
    }
    setShowQuantityModal(true);
  };

  const getAvailableQuantity = () => {
    const totalInStock = getRest();
    const alreadyInBasket =
      store.basketArray.find((item) => item.code === dataItem.code)?.quantity ||
      0;
    return Math.max(0, totalInStock - alreadyInBasket);
  };

  const getPrice = () => {
    return getPriceWithMarkup(dataItem);
  };

  const getRest = () => {
    return getTotalRest(dataItem);
  };

  return (
    <div className={style.productCard}>
      <Link href={`/product/${dataItem.code}`} className={style.productLink}>
        <div className={style.imageContainer}>
          <ImageWithoutWatermark
            imgBigMy={dataItem.img_big_my}
            imgBigPish={dataItem.img_big_pish}
            imgSmall={dataItem.img_small}
            alt={dataItem.name}
            width={120}
            height={120}
            className={style.productImage}
            useSmallImage={true}
          />
        </div>

        <div className={style.productInfo}>
          <h4 className={style.productName}>{dataItem.name}</h4>
          <p className={style.productDetails}>
            {dataItem.marka} {dataItem.model}
          </p>
          {dataItem.season && (
            <p className={style.productSeason}>
              {getSeasonDisplayName(dataItem.season)}
            </p>
          )}
          <p className={style.productCode}>Код: {dataItem.code}</p>
          <p className={style.productRest}>{getRest()} шт в наличии</p>
        </div>
      </Link>

      <div className={style.actionSection}>
        <div className={style.price}>{getPrice().toLocaleString()}р</div>
        {isLoading ? (
          <div className={style.loadingButton}>
            <LoaderComponent />
            <span>Добавление...</span>
          </div>
        ) : !alreadyAdded ? (
          <ButtonComponent
            variant="filled"
            text="В корзину"
            onClick={handleAddToBasketClick}
            className={style.addButton}
          />
        ) : (
          <ButtonComponent
            variant="filled"
            text="Добавить еще"
            onClick={handleAddToBasketClick}
            className={style.addButton}
          />
        )}
      </div>

      <ModalComponent
        opened={showQuantityModal}
        close={() => setShowQuantityModal(false)}
        title="Добавить в корзину"
      >
        <AddQuantityModal
          onSubmit={handleQuantitySubmit}
          isPending={isLoading}
          productName={dataItem.name}
          maxQuantity={getAvailableQuantity()}
        />
      </ModalComponent>

      <ModalComponent
        opened={showErrorModal}
        close={() => setShowErrorModal(false)}
        title="Ошибка"
      >
        <div className={style.errorModalContent}>
          <p>{errorMessage}</p>
          <ButtonComponent
            variant="filled"
            text="ОК"
            onClick={() => setShowErrorModal(false)}
            className={style.errorModalButton}
          />
        </div>
      </ModalComponent>
    </div>
  );
};
