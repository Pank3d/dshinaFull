"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import style from "./AddQuantityModal.module.scss";

interface AddQuantityModalProps {
  onSubmit: (values: { quantity: number }) => void;
  isPending?: boolean;
  productName?: string;
  maxQuantity?: number;
}

export const AddQuantityModal: React.FC<AddQuantityModalProps> = ({
  onSubmit,
  isPending = false,
  productName = "резины",
  maxQuantity = 100,
}) => {
  const validationSchema = Yup.object({
    quantity: Yup.number()
      .min(1, "Количество должно быть больше 0")
      .max(maxQuantity, `Максимальное количество: ${maxQuantity} шт`)
      .required("Укажите количество"),
  });

  if (maxQuantity <= 0) {
    return (
      <div className={style.addQuantityForm}>
        <h3 className={style.formTitle}>Товар недоступен</h3>
        <p className={style.formDescription}>
          К сожалению, {productName} закончился или уже добавлен в максимальном количестве.
        </p>
      </div>
    );
  }

  return (
    <div className={style.addQuantityForm}>
      <h3 className={style.formTitle}>Добавить в корзину</h3>
      <p className={style.formDescription}>
        Укажите количество {productName} для добавления в корзину
        <br />
        <small className={style.availableQuantity}>
          Доступно: {maxQuantity} шт
        </small>
      </p>

      <Formik
        initialValues={{ quantity: 1 }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form className={style.form}>
            <div className={style.fieldGroup}>
              <label className={style.fieldLabel}>Количество</label>
              <Field
                name="quantity"
                type="number"
                min="1"
                max={maxQuantity}
                placeholder="1"
                className={`${style.fieldInput} ${
                  errors.quantity && touched.quantity ? style.fieldError : ""
                }`}
              />
              <ErrorMessage
                name="quantity"
                component="div"
                className={style.errorMessage}
              />
            </div>

            <div className={style.buttonGroup}>
              <button
                type="submit"
                disabled={isPending}
                className={style.submitButton}
              >
                {isPending ? "Добавление..." : "Добавить в корзину"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};