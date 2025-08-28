"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SelectComponent from "../../shared/ui/Select/Select";
import {
  useGetGoodsByCar,
  useGetMarkaAvto,
  useGetModelAvto,
  useGetModificationAvto,
  useGetWarehouses,
  useGetYearAvto,
} from "../../entities/markiAvto/api/query";
import { LoaderComponent } from "../../shared/ui/Loader/Loader";
import { ProductList } from "../ProductList";
import style from "./GetProductListForm.module.scss";

export const GetProductListForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [marka, setMarka] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [modification, setModification] = useState("");

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
      podborType,
      season: season.length ? season.join(",") : undefined,
      thom: thom || undefined,
      type,
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
      podborType,
      season: season.length ? season.join(",") : undefined,
      thom: thom || undefined,
      type,
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
      podborType,
      season: season.length ? season.join(",") : undefined,
      thom: thom || undefined,
      type,
    });
  };
  const [podborType, setPodborType] = useState<number>();
  const [season, setSeason] = useState([]);
  const [thom, setThom] = useState(false);
  const [type, setType] = useState();
  const [wrhList, setWrhList] = useState([]);

  // Функция для обновления URL с параметрами
  const updateURL = (
    params: Record<string, string | number | boolean | undefined>
  ) => {
    const newSearchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== false) {
        newSearchParams.set(key, String(value));
      }
    });

    const newURL = newSearchParams.toString()
      ? `?${newSearchParams.toString()}`
      : window.location.pathname;

    router.push(newURL, { scroll: false });
  };

  // Функция для восстановления данных из URL
  useEffect(() => {
    const markaParam = searchParams.get("marka") || "";
    const modelParam = searchParams.get("model") || "";
    const yearParam = searchParams.get("year") || "";
    const modificationParam = searchParams.get("modification") || "";
    const podborTypeParam = searchParams.get("podborType");
    const seasonParam = searchParams.get("season");
    const thomParam = searchParams.get("thom");
    const typeParam = searchParams.get("type");

    if (markaParam) setMarka(markaParam);
    if (modelParam) setModel(modelParam);
    if (yearParam) setYear(yearParam);
    if (modificationParam) setModification(modificationParam);
    if (podborTypeParam) setPodborType(Number(podborTypeParam));
    if (seasonParam) setSeason(seasonParam.split(",") as any);
    if (thomParam) setThom(thomParam === "true");
    if (typeParam) setType(typeParam as any);
  }, [searchParams]);

  // Обновляем URL при изменении параметров
  useEffect(() => {
    if (
      marka ||
      model ||
      year ||
      modification ||
      podborType ||
      season.length ||
      thom ||
      type
    ) {
      updateURL({
        marka,
        model,
        year,
        modification,
        podborType,
        season: season.length ? season.join(",") : undefined,
        thom: thom || undefined,
        type,
      });
    }
  }, [marka, model, year, modification, podborType, season, thom, type]);

  const parseDate = (date: string) => {
    const [year_beg, year_end] = date.split("-");
    return { year_beg: parseInt(year_beg), year_end: parseInt(year_end) };
  };

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
      [parseDate(year).year_beg],
      [parseDate(year).year_end]
    );

  const renderDataYearOptions = () => {
    const options = dataYear?.map(
      (year: { year_begin: number; year_end: number }) => ({
        label: `${year.year_begin} - ${year.year_end}`,
        value: `${year.year_begin}-${year.year_end}`,
      })
    );

    return options;
  };
  const {
    data: goodsData,
    isLoading: isLoadingTestGetGoods,
    error: errorTestGetGoods,
  } = useGetGoodsByCar(
    marka,
    model,
    modification,
    [parseDate(year).year_beg],
    [parseDate(year).year_end],
    [podborType],
    [season],
    thom,
    [],
    wrhList
  );

  const filteredGoodsData = goodsData?.price_rest_list?.goods_price_rest.filter(
    (item) => {
      if (!type) {
        return true;
      }
      return item.type === type;
    }
  ); 



  return (
    <div className="p-7">
      <div className={style.formContainer}>
        <h2 className={style.formTitle}>🚗 Подбор шин по автомобилю</h2>

        <Formik
          initialValues={{
            marka: marka,
            model: model,
            year: year,
            modification: modification,
            podbor_type: podborType?.toString() || "",
            season_list: season.join(",") || "",
            thom: thom.toString(),
            type: type || "",
          }}
          enableReinitialize={true}
          validationSchema={Yup.object({
            marka: Yup.string().required("Выберите марку"),
          })}
          validateOnChange={true}
          onSubmit={(values) => console.log("Отправка:", values)}
        >
          <Form>
            <div className={style.formRow}>
              <div className={style.selectWrapper}>
                <Field
                  name="marka"
                  component={SelectComponent}
                  label="Марка автомобиля"
                  placeholder={
                    isLoading ? "Загружаем данные..." : "Выберите марку"
                  }
                  data={dataMarki || []}
                  onChangeFromParent={handleMarkaChange}
                  searchable
                  disabled={isLoading}
                />
              </div>

              <div className={style.selectWrapper}>
                <Field
                  name="model"
                  component={SelectComponent}
                  label="Модель автомобиля"
                  placeholder={
                    isLoadingModel ? "Загружаем данные..." : "Выберите модель"
                  }
                  data={dataModel || []}
                  onChangeFromParent={handleModelChange}
                  searchable
                  disabled={isLoadingModel}
                />
              </div>

              <div className={style.selectWrapper}>
                <Field
                  name="year"
                  component={SelectComponent}
                  label="Год выпуска"
                  placeholder={
                    isLoadingYear || isLoadingModel || isLoading || !dataYear
                      ? "Загружаем данные..."
                      : "Выберите год"
                  }
                  data={renderDataYearOptions()}
                  onChangeFromParent={handleYearChange}
                  searchable
                  disabled={
                    isLoadingYear || isLoadingModel || isLoading || !dataYear
                  }
                />
              </div>

              <div className={style.selectWrapper}>
                <Field
                  name="modification"
                  component={SelectComponent}
                  label="Модификация"
                  placeholder={
                    isLoadingModification
                      ? "Загружаем данные..."
                      : "Выберите модификацию"
                  }
                  data={dataModification || []}
                  onChangeFromParent={setModification}
                  searchable
                  disabled={isLoadingModification}
                />
              </div>
            </div>

            {/* <div className={style.formRow}>
              <div className={style.selectWrapper}>
                <Field
                  name="podbor_type"
                  component={SelectComponent}
                  label="Тип подбора"
                  placeholder="Выберите тип подбора"
                  data={[
                    {
                      label: "Штатный размер",
                      value: "1",
                    },
                    {
                      label: "Не штатный размер",
                      value: "2",
                    },
                    {
                      label: "Тюнинговый размер",
                      value: "3",
                    },
                  ]}
                  onChangeFromParent={setPodborType}
                  searchable
                />
              </div>
              
              <div className={style.selectWrapper}>
                <Field
                  name="season_list"
                  component={SelectComponent}
                  label="Сезонность"
                  placeholder="Выберите сезон"
                  data={[
                    {
                      label: "Летние шины",
                      value: "w",
                    },
                    {
                      label: "Зимние шины",
                      value: "s",
                    },
                    {
                      label: "Всесезонные шины",
                      value: "u",
                    },
                  ]}
                  onChangeFromParent={setSeason}
                  searchable
                />
              </div>
              
              <div className={style.selectWrapper}>
                <Field
                  name="thom"
                  component={SelectComponent}
                  label="Шипованные"
                  placeholder="С шипами или без"
                  data={[
                    {
                      label: "С шипами",
                      value: "true",
                    },
                    {
                      label: "Без шипов",
                      value: "false",
                    },
                  ]}
                  onChangeFromParent={setThom}
                />
              </div>
            </div>
            
            <div className={style.formRowSingle}>
              <div className={style.selectWrapper}>
                <Field
                  name="type"
                  component={SelectComponent}
                  label="Тип товара"
                  placeholder="Выберите тип товара"
                  data={[
                    {
                      label: "🛣 Диски",
                      value: "disk",
                    },
                    {
                      label: "🚗 Легковые шины",
                      value: "car",
                    },
                    {
                      label: "🚐 Легкогрузовые шины",
                      value: "cartruck",
                    },
                    {
                      label: "🏭 Погрузчики и складская техника",
                      value: "loader",
                    },
                    {
                      label: "🏍 Мотошины",
                      value: "moto",
                    },
                    {
                      label: "🚜 Сельхозтехника",
                      value: "selhoz",
                    },
                    {
                      label: "🏗 Строительная и КГШ",
                      value: "specteh",
                    },
                    {
                      label: "🚛 Грузовые шины",
                      value: "truck",
                    },
                    {
                      label: "🚙 Внедорожные шины (4x4)",
                      value: "vned",
                    },
                    {
                      label: "🏎 Квадроциклы",
                      value: "quadbike",
                    },
                    {
                      label: "🔧 Прочее",
                      value: "other",
                    },
                  ]}
                  onChangeFromParent={setType}
                  searchable
                />
              </div>
            </div> */}
          </Form>
        </Formik>
      </div>

      <div className={style.resultsSection}>
        {isLoadingTestGetGoods ? (
          <div className={style.loadingState}>
            <LoaderComponent />
            <p style={{ marginTop: "16px", color: "#6b7280" }}>
              Загружаем шины...
            </p>
          </div>
        ) : goodsData && filteredGoodsData && filteredGoodsData.length > 0 ? (
          <ProductList data={filteredGoodsData} />
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
