"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { FieldConfig } from "../../../shared/ui/FormComponent";
import { useUpdateURL } from "../../../shared/url/urlHelpers";
import { useFindTyre } from "../../../entities/tyres";
import {
  FindTyreFilter,
  SEASON_OPTIONS,
  WIDTH_OPTIONS,
  HEIGHT_OPTIONS,
  DIAMETER_OPTIONS,
  TyreInfo,
} from "../../../entities/tyres/api/types";

export const useTyreSearchForm = () => {
  const searchParams = useSearchParams();
  const { updateURL } = useUpdateURL();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<FindTyreFilter>({});
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [diameter, setDiameter] = useState("");
  const [season, setSeason] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [isInitialized, setIsInitialized] = useState(false);

  // Восстановление данных из URL
  useEffect(() => {
    const widthParam = searchParams.get("width") || "";
    const heightParam = searchParams.get("height") || "";
    const diameterParam = searchParams.get("diameter") || "";
    const seasonParam = searchParams.get("season") || "";
    const priceMinParam = searchParams.get("priceMin") || "";
    const priceMaxParam = searchParams.get("priceMax") || "";
    const pageParam = searchParams.get("page") || "0";
    const pageSizeParam = searchParams.get("per_page") || "20";

    setWidth(widthParam);
    setHeight(heightParam);
    setDiameter(diameterParam);
    setSeason(seasonParam);
    setPriceMin(priceMinParam);
    setPriceMax(priceMaxParam);
    setPage(parseInt(pageParam, 10));
    setPageSize(parseInt(pageSizeParam, 10));
    setIsInitialized(true);
  }, [searchParams]);

  // Обновление фильтра при изменении параметров
  useEffect(() => {
    const newFilter: FindTyreFilter = {};

    if (width) newFilter.width_min = newFilter.width_max = parseInt(width);
    if (height) newFilter.height_min = newFilter.height_max = parseInt(height);
    if (diameter)
      newFilter.diameter_min = newFilter.diameter_max = parseInt(diameter);
    if (season) newFilter.season_list = [season];
    if (priceMin) newFilter.price_min = parseInt(priceMin);
    if (priceMax) newFilter.price_max = parseInt(priceMax);

    setFilter(newFilter);
  }, [width, height, diameter, season, priceMin, priceMax]);

  // Обновление URL при изменении параметров (только после инициализации)
  useEffect(() => {
    if (isInitialized) {
      updateURL({
        width,
        height,
        diameter,
        season,
        priceMin,
        priceMax,
        page: page.toString(),
        per_page: pageSize.toString(),
      });
    }
  }, [
    width,
    height,
    diameter,
    season,
    priceMin,
    priceMax,
    page,
    pageSize,
    isInitialized,
  ]);

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    if (isInitialized && page > 0) {
      setPage(0);
    }
  }, [width, height, diameter, season, priceMin, priceMax, isInitialized]);

  const handleWidthChange = (value: string) => {
    setWidth(value);
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
  };

  const handleDiameterChange = (value: string) => {
    setDiameter(value);
  };

  const handleSeasonChange = (value: string) => {
    setSeason(value);
  };

  const handlePriceMinChange = (value: string) => {
    setPriceMin(value);
  };

  const handlePriceMaxChange = (value: string) => {
    setPriceMax(value);
  };

  // Получение шин
  const shouldSearch = Boolean(
    width || height || diameter || priceMax || priceMin
  );
  const {
    data: tyresData,
    isLoading: isLoadingTyres,
    error: errorTyres,
  } = useFindTyre(filter, page, pageSize, shouldSearch);

  // Обработчики пагинации
  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1); // API использует 0-based индексацию
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0); // Сброс на первую страницу
  };

  // Конфигурация полей
  const fieldsConfig: FieldConfig[] = [
    {
      name: "width",
      label: "Ширина шины",
      type: "select",
      placeholder: "Выберите ширину",
      data: WIDTH_OPTIONS,
      onChangeFromParent: handleWidthChange,
      searchable: true,
    },
    {
      name: "height",
      label: "Высота профиля",
      type: "select",
      placeholder: !width ? "Сначала выберите ширину" : "Выберите высоту",
      data: HEIGHT_OPTIONS,
      onChangeFromParent: handleHeightChange,
      searchable: true,
      disabled: !width,
    },
    {
      name: "diameter",
      label: "Диаметр диска",
      type: "select",
      placeholder:
        !width || !height
          ? "Сначала выберите ширину и высоту"
          : "Выберите диаметр",
      data: DIAMETER_OPTIONS,
      onChangeFromParent: handleDiameterChange,
      searchable: true,
      disabled: !width || !height,
    },
    {
      name: "season",
      label: "Сезон",
      type: "select",
      placeholder: "Выберите сезон (опционально)",
      data: SEASON_OPTIONS,
      onChangeFromParent: handleSeasonChange,
    },
    {
      name: "priceMin",
      label: "Цена от",
      type: "text",
      placeholder: "Минимальная цена",
      onChangeFromParent: handlePriceMinChange,
    },
    {
      name: "priceMax",
      label: "Цена до",
      type: "text",
      placeholder: "Максимальная цена",
      onChangeFromParent: handlePriceMaxChange,
    },
  ];

  const resetAllFilters = () => {
    setWidth("");
    setHeight("");
    setDiameter("");
    setSeason("");
    setPriceMin("");
    setPriceMax("");
    setPage(0);
    // URL будет обновлен автоматически через useEffect
    // Сбрасываем кеш
    queryClient.removeQueries({
      queryKey: ["findTyre"],
    });
  };

  return {
    // Состояния
    formValues: { width, height, diameter, season, priceMin, priceMax },
    // Конфигурация
    fieldsConfig,
    // Методы сброса
    resetFilters: resetAllFilters,
    // Данные
    tyresData: tyresData?.price_rest_list?.TyrePriceRest,
    isLoading: shouldSearch ? isLoadingTyres : false,
    error: shouldSearch ? errorTyres : null,
    // Пагинация
    pagination: {
      currentPage: page + 1, // Конвертируем в 1-based для UI
      pageSize,
      totalItems: tyresData?.totalPages
        ? tyresData.totalPages * pageSize
        : tyresData?.price_rest_list?.TyrePriceRest?.length || 0,
      totalPages:
        tyresData?.totalPages ||
        Math.ceil(
          (tyresData?.price_rest_list?.TyrePriceRest?.length || 0) / pageSize
        ),
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
    },
  };
};
