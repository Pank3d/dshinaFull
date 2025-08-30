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
  DIAMETER_OPTIONS 
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

  // Восстановление данных из URL
  useEffect(() => {
    const widthParam = searchParams.get("width") || "";
    const heightParam = searchParams.get("height") || "";
    const diameterParam = searchParams.get("diameter") || "";
    const seasonParam = searchParams.get("season") || "";
    const priceMinParam = searchParams.get("priceMin") || "";
    const priceMaxParam = searchParams.get("priceMax") || "";

    setWidth(widthParam);
    setHeight(heightParam);
    setDiameter(diameterParam);
    setSeason(seasonParam);
    setPriceMin(priceMinParam);
    setPriceMax(priceMaxParam);
  }, [searchParams]);

  // Обновление фильтра при изменении параметров
  useEffect(() => {
    const newFilter: FindTyreFilter = {};
    
    if (width) newFilter.width_min = newFilter.width_max = parseInt(width);
    if (height) newFilter.height_min = newFilter.height_max = parseInt(height);
    if (diameter) newFilter.diameter_min = newFilter.diameter_max = parseInt(diameter);
    if (season) newFilter.season_list = [season];
    if (priceMin) newFilter.price_min = parseInt(priceMin);
    if (priceMax) newFilter.price_max = parseInt(priceMax);

    setFilter(newFilter);
  }, [width, height, diameter, season, priceMin, priceMax]);

  // Обновление URL при изменении параметров
  useEffect(() => {
    updateURL({
      width,
      height,
      diameter,
      season,
      priceMin,
      priceMax,
    });
  }, [width, height, diameter, season, priceMin, priceMax]);

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
  const shouldSearch = Boolean(width && height && diameter);
  const {
    data: tyresData,
    isLoading: isLoadingTyres,
    error: errorTyres,
  } = useFindTyre(filter, 0, 50, shouldSearch);

  const filteredTyresData = shouldSearch ? tyresData?.price_rest_list : null;

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
      placeholder: !width || !height ? "Сначала выберите ширину и высоту" : "Выберите диаметр",
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
    updateURL({
      width: "",
      height: "",
      diameter: "",
      season: "",
      priceMin: "",
      priceMax: "",
    });
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
    tyresData: filteredTyresData,
    isLoading: shouldSearch ? isLoadingTyres : false,
    error: shouldSearch ? errorTyres : null,
  };
};