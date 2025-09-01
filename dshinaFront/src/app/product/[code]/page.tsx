"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductDetailView } from "../../../../fsd/pages/ProductDetail/ProductDetailView";
import { GoodsPriceRest } from "../../../../fsd/entities/markiAvto/api/types";
import { LoaderComponent } from "../../../../fsd/shared/ui/Loader/Loader";
import { ButtonComponent } from "../../../../fsd/shared/ui/Button";
import { useProductsStore } from "../../../../fsd/entities/products";
import styles from "./page.module.scss";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [product, setProduct] = useState<GoodsPriceRest | null>(null);
  const [loading, setLoading] = useState(true);
  const { getProductByCode } = useProductsStore();

  useEffect(() => {
    const findProduct = () => {
      // Ищем товар в store
      const productFromStore = getProductByCode(code);
      if (productFromStore) {
        setProduct(productFromStore);
        setLoading(false);
        return;
      }

      // Товар не найден
      setProduct(null);
      setLoading(false);
    };

    findProduct();
  }, [code, getProductByCode]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoaderComponent />
        <p>Загрузка товара...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Товар не найден</h2>
        <ButtonComponent
          variant="outlined"
          text="Вернуться к каталогу"
          onClick={() => router.back()}
        />
      </div>
    );
  }

  return <ProductDetailView product={product} />;
}
