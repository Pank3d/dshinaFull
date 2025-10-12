"use client";
import { LoaderComponent } from "../../shared/ui/Loader/Loader";
import { ProductList } from "../ProductList";
import { TyreFilterForm } from "./components/TyreFilterForm";
import { useTyreSearchForm } from "./hooks/useTyreSearchForm";
import { Pagination } from "../../shared/ui/Pagination";
import style from "./TyreSearch.module.scss";

export const TyreSearchForm = () => {
  const hookData = useTyreSearchForm();
  const { tyresData, isLoading, error, pagination } = hookData;

  return (
    <div className="p-7">
      <TyreFilterForm hookData={hookData} />

      <div className={style.resultsSection}>
        {isLoading ? (
          <div className={style.loadingState}>
            <LoaderComponent />
            <p className={style.loadingText}>Поиск шин...</p>
          </div>
        ) : tyresData && tyresData.length > 0 ? (
          <>
            <ProductList data={tyresData} />
            {/* <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              itemsPerPage={pagination.pageSize}
              totalItems={pagination.totalItems}
              onPageChange={pagination.onPageChange}
              onItemsPerPageChange={pagination.onPageSizeChange}
            /> */}
          </>
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
