"use client";
import { LoaderComponent } from "../../shared/ui/Loader/Loader";
import { ProductList } from "../ProductList";
import { TyreFilterForm } from "./components/TyreFilterForm";
import { useTyreSearchForm } from "./hooks/useTyreSearchForm";
import style from "./TyreSearch.module.scss";

export const TyreSearchForm = () => {
  const hookData = useTyreSearchForm();
  const { tyresData, isLoading, error } = hookData;

  return (
    <div className="p-7">
      <TyreFilterForm hookData={hookData} />
      
      <div className={style.resultsSection}>
        {isLoading ? (
          <div className={style.loadingState}>
            <LoaderComponent />
            <p style={{ marginTop: "16px", color: "#6b7280" }}>
              Поиск шин...
            </p>
          </div>
        ) : tyresData && tyresData.length > 0 ? (
          <ProductList data={tyresData} />
        ) : (
          <p className={style.anyText}>
            🔍 Здесь будут найденные шины
            <small>Выберите параметры шин для поиска</small>
          </p>
        )}
      </div>
    </div>
  );
};