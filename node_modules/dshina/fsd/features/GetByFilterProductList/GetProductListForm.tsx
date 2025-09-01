"use client";
import { LoaderComponent } from "../../shared/ui/Loader/Loader";
import { ProductList } from "../ProductList";
import { CarFilterForm } from "./components/CarFilterForm";
import { useCarFilterForm } from "./hooks/useCarFilterForm";
import style from "./GetProductListForm.module.scss";

export const GetProductListForm = () => {
  const hookData = useCarFilterForm();
  const { goodsData, isLoading, error } = hookData;

  return (
    <div className="p-7">
      <CarFilterForm hookData={hookData} />

      <div className={style.resultsSection}>
        {isLoading ? (
          <div className={style.loadingState}>
            <LoaderComponent />
            <p className={style.loadingText}>Загружаем шины...</p>
          </div>
        ) : goodsData && goodsData.length > 0 ? (
          <ProductList data={goodsData} />
        ) : (
          <p className={style.anyText}>
            🔍 Здесь будут ваши шины
            <small>Выберите параметры автомобиля для поиска</small>
          </p>
        )}
      </div>
    </div>
  );
};
