"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { FieldConfig } from "../../../shared/ui/FormComponent";
import { useUpdateURL } from "../../../shared/url/urlHelpers";
import {
  useGetMarkaAvto,
  useGetModelAvto,
  useGetModificationAvto,
  useGetYearAvto,
  useGetGoodsByCar,
} from "../../../entities/markiAvto/api/query";

export const useCarFilterForm = () => {
  const searchParams = useSearchParams();
  const { updateURL } = useUpdateURL();
  const queryClient = useQueryClient();

  const [marka, setMarka] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [modification, setModification] = useState("");

  const resetFiltersAfterChangeMarka = () => {
    if (model !== "" || year !== "" || modification !== "") {
      setMarka("");
      setModel("");
      setYear("");
      setModification("");
      updateURL({
        marka: "",
        model: "",
        year: "",
        modification: "",
      });
    }
  };

  const handleMarkaChange = (value: string) => {
    setMarka(value);
    setModel("");
    setYear("");
    setModification("");
    updateURL({
      marka: value,
      model: "",
      year: "",
      modification: "",
    });
  };

  const handleModelChange = (value: string) => {
    setModel(value);
    setYear("");
    setModification("");
    updateURL({
      marka,
      model: value,
      year: "",
      modification: "",
    });
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    setModification("");
    updateURL({
      marka,
      model,
      year: value,
      modification: "",
    });
  };

  // Восстановление данных из URL
  useEffect(() => {
    const markaParam = searchParams.get("marka") || "";
    const modelParam = searchParams.get("model") || "";
    const yearParam = searchParams.get("year") || "";
    const modificationParam = searchParams.get("modification") || "";

    if (markaParam) setMarka(markaParam);
    if (modelParam) setModel(modelParam);
    if (yearParam) setYear(yearParam);
    if (modificationParam) setModification(modificationParam);
  }, [searchParams]);

  // Обновление URL при изменении параметров
  useEffect(() => {
    if (marka || model || year || modification) {
      updateURL({
        marka,
        model,
        year,
        modification,
      });
    }
  }, [marka, model, year, modification]);

  // API хуки
  const { data: dataMarki, isLoading } = useGetMarkaAvto();
  const { data: dataModel, isLoading: isLoadingModel } = useGetModelAvto(marka);
  const { data: dataYear, isLoading: isLoadingYear } = useGetYearAvto(
    marka,
    model
  );
  const { data: dataModification, isLoading: isLoadingModification } =
    useGetModificationAvto(
      marka,
      model,
      year ? [parseInt(year.split("-")[0])] : [0],
      year ? [parseInt(year.split("-")[1])] : [0]
    );

  // Парсинг дат для года
  const parseDate = (date: string) => {
    const [year_beg, year_end] = date.split("-");
    return { year_beg: parseInt(year_beg), year_end: parseInt(year_end) };
  };

  // Рендеринг опций года
  const renderDataYearOptions = () => {
    const options = dataYear?.map(
      (year: { year_begin: number; year_end: number }) => ({
        label: `${year.year_begin} - ${year.year_end}`,
        value: `${year.year_begin}-${year.year_end}`,
      })
    );
    return options;
  };

  // Получение товаров
  const {
    data: goodsData,
    isLoading: isLoadingTestGetGoods,
    error: errorTestGetGoods,
  } = useGetGoodsByCar(
    marka,
    model,
    modification,
    year ? [parseDate(year).year_beg] : [0],
    year ? [parseDate(year).year_end] : [0]
  );

  // Если все фильтры пустые, товары не должны отображаться
  const shouldShowGoods = Boolean(marka && model && year);
  const filteredGoodsData = shouldShowGoods ? goodsData?.price_rest_list?.goods_price_rest : null;

  const handleModificationChange = (value: string) => {
    setModification(value);
    updateURL({
      marka,
      model,
      year,
      modification: value,
    });
  };

  // Конфигурация полей
  const fieldsConfig: FieldConfig[] = [
    {
      name: "marka",
      label: "Марка автомобиля",
      type: "select",
      placeholder: isLoading ? "Загружаем данные..." : "Выберите марку",
      data: dataMarki || [],
      onChange: () => resetFiltersAfterChangeMarka(),
      onChangeFromParent: handleMarkaChange,
      searchable: true,
      disabled: isLoading,
    },
    {
      name: "model",
      label: "Модель автомобиля",
      type: "select",
      placeholder: isLoadingModel || !marka ? "Сначала выберите марку" : "Выберите модель",
      data: dataModel || [],
      onChangeFromParent: handleModelChange,
      searchable: true,
      disabled: isLoadingModel || !marka,
    },
    {
      name: "year",
      label: "Год выпуска",
      type: "select",
      placeholder:
        !marka || !model
          ? "Сначала выберите марку и модель"
          : isLoadingYear || isLoadingModel || isLoading || !dataYear
          ? "Загружаем данные..."
          : "Выберите год",
      data: renderDataYearOptions() || [],
      onChangeFromParent: handleYearChange,
      searchable: true,
      disabled: !marka || !model || isLoadingYear || isLoadingModel || isLoading || !dataYear,
    },
    {
      name: "modification",
      label: "Модификация",
      type: "select",
      placeholder: 
        !marka || !model || !year
          ? "Сначала выберите марку, модель и год"
          : isLoadingModification
          ? "Загружаем данные..."
          : "Выберите модификацию",
      data: dataModification || [],
      onChangeFromParent: handleModificationChange,
      searchable: true,
      disabled: !marka || !model || !year || isLoadingModification,
    },
  ];

  const resetAllFilters = () => {
    setMarka("");
    setModel("");
    setYear("");
    setModification("");
    updateURL({
      marka: "",
      model: "",
      year: "",
      modification: "",
    });
    // Сбрасываем кеш товаров
    queryClient.removeQueries({
      queryKey: ["goods"],
    });
  };

  return {
    // Состояния
    formValues: { marka, model, year, modification },
    // Конфигурация
    fieldsConfig,
    // Методы сброса
    resetFilters: resetAllFilters,
    // Данные
    goodsData: filteredGoodsData,
    isLoading: shouldShowGoods ? isLoadingTestGetGoods : false,
    error: shouldShowGoods ? errorTestGetGoods : null,
  };
};
