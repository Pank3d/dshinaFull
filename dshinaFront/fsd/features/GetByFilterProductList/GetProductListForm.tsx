"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState } from "react";
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
  const [marka, setMarka] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [modification, setModification] = useState("");
  const [podborType, setPodborType] = useState<number>();
  const [season, setSeason] = useState([]);
  const [thom, setThom] = useState(false);
  const [type, setType] = useState();
  const [wrhList, setWrhList] = useState([]);
  const { data: dataWarehouses, isLoading: isLoadingWarehouses } =
    useGetWarehouses();

  const parseDate = (date: string) => {
    const [year_beg, year_end] = date.split("-");
    return { year_beg: parseInt(year_beg), year_end: parseInt(year_end) };
  };

  const parseThom = (thom: string) => {
    return thom === "true" ? true : false;
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
    if (!dataYear) {
      return [
        {
          label: "Год загружается...",
          value: "",
        },
      ];
    }

    const options = dataYear.map(
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
      <Formik
        initialValues={{ marka: "" }}
        validationSchema={Yup.object({
          marka: Yup.string().required("Выберите марку"),
        })}
        validateOnChange={true}
        onSubmit={(values) => console.log("Отправка:", values)}
      >
        <Form>
          <div className="flex">
            {isLoading ? (
              <LoaderComponent />
            ) : (
              <Field
                name="marka"
                component={SelectComponent}
                label="Марка"
                placeholder="Выберите марку"
                data={dataMarki}
                onChangeFromParent={setMarka}
                searchable
              />
            )}
            {isLoadingModel ? (
              <LoaderComponent />
            ) : (
              <Field
                name="model"
                component={SelectComponent}
                label="Модель"
                placeholder="Выберите модель"
                data={dataModel}
                onChangeFromParent={setModel}
                searchable
              />
            )}
            {isLoadingYear ? (
              <LoaderComponent />
            ) : (
              <Field
                name="year"
                component={SelectComponent}
                label="Год"
                placeholder="Выберите год"
                data={renderDataYearOptions()}
                onChangeFromParent={setYear}
                searchable
              />
            )}
            {isLoadingModification ? (
              <LoaderComponent />
            ) : (
              <Field
                name="modification"
                component={SelectComponent}
                label="Модификация"
                placeholder="Выберите модификацию"
                data={dataModification}
                onChangeFromParent={setModification}
                searchable
              />
            )}
          </div>
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
          <Field
            name="season_list"
            component={SelectComponent}
            label="Сезон"
            placeholder="Выберите сезон"
            data={[
              {
                label: "Летние",
                value: "w",
              },
              {
                label: "Зимние",
                value: "s",
              },
              {
                label: "Всесезонные",
                value: "u",
              },
            ]}
            onChangeFromParent={setSeason}
            searchable
          />
          <Field
            name="thom"
            component={SelectComponent}
            label="С щипами"
            placeholder="Выберите температуру"
            data={[
              {
                label: "Да",
                value: "true",
              },
              {
                label: "Нет",
                value: "false",
              },
            ]}
            onChangeFromParent={setThom}
          />
          <Field
            name="type"
            component={SelectComponent}
            label="Тип"
            placeholder="Выберите тип"
            data={[
              {
                label: "диск",
                value: "disk",
              },
              {
                label: "Легковая шина",
                value: "car",
              },
              {
                label: "Легкогрузовая шина (микроавтобусы)",
                value: "cartruck",
              },
              {
                label:
                  "Шина для вилочных погрузчиков и Складская и портовая техника",
                value: "loader",
              },
              {
                label: "Мотошина",
                value: "moto",
              },
              {
                label: "Сельхозтехника",
                value: "selhoz",
              },
              {
                label: "Строительная и КГШ",
                value: "specteh",
              },
              {
                label: "Грузовая шина",
                value: "truck",
              },
              {
                label: "Внедорожная шина (4x4)",
                value: "vned",
              },
              {
                label: "Шина для квадроциклов",
                value: "quadbike",
              },
              {
                label: "Прочего назначения",
                value: "other",
              },
            ]}
            onChangeFromParent={setType}
          />
        </Form>
      </Formik>
      {goodsData && filteredGoodsData ? (
        <ProductList data={filteredGoodsData} />
      ) : (
        <p className={style.anyText}> Здесь буду ваши шины </p>
      )}
    </div>
  );
};
