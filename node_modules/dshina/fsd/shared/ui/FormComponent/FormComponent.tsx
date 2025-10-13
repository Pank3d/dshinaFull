"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ReactNode } from "react";
import SelectComponent from "../Select/Select";
import { PriceRangeField } from "../PriceRangeField";
import { DualRangeSlider } from "../DualRangeSlider";
import style from "./FormComponent.module.scss";

export interface FieldConfig {
  name: string;
  label: string;
  type: "select" | "text" | "number" | "priceRange" | "rangeSlider";
  placeholder?: string;
  placeholderMin?: string;
  placeholderMax?: string;
  data?: Array<{ label: string; value: string | number }>;
  onChangeFromParent?: (value: any) => void;
  onPriceMinChange?: (value: string) => void;
  onPriceMaxChange?: (value: string) => void;
  onMinChange?: (value: number) => void;
  onMaxChange?: (value: number) => void;
  priceMin?: string;
  priceMax?: string;
  min?: number;
  max?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  formatValue?: (value: number) => string;
  onChange?: (value: any) => void;
  onReset?: () => void;
  searchable?: boolean;
  disabled?: boolean;
  visible?: boolean;
  validation?: Yup.StringSchema | Yup.NumberSchema;
}

export interface FormComponentProps {
  fields: FieldConfig[];
  initialValues: Record<string, any>;
  title?: string;
  onSubmit?: (values: Record<string, any>) => void;
  className?: string;
  children?:
    | ReactNode
    | ((formikProps: { resetForm: () => void }) => ReactNode);
}

export const FormComponent: React.FC<FormComponentProps> = ({
  fields,
  initialValues,
  title,
  onSubmit = () => {},
  className = "",
  children,
}) => {
  // Создаем схему валидации на основе полей
  const validationSchema = Yup.object(
    fields.reduce(
      (schema, field) => {
        if (field.validation) {
          schema[field.name] = field.validation;
        }
        return schema;
      },
      {} as Record<string, any>
    )
  );

  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case "select":
        return (
          <Field
            name={field.name}
            component={SelectComponent}
            label={field.label}
            placeholder={
              field.placeholder || `Выберите ${field.label.toLowerCase()}`
            }
            data={field.data || []}
            onChangeFromParent={field.onChangeFromParent}
            onChange={field.onChange}
            onReset={field.onReset}
            searchable={field.searchable}
            disabled={field.disabled}
          />
        );
      case "text":
        return (
          <Field name={field.name}>
            {({ field: formikField, form }: any) => (
              <div className={style.inputFieldWrapper}>
                {field.label && (
                  <label className={style.inputLabel}>{field.label}</label>
                )}
                <input
                  {...formikField}
                  type="text"
                  placeholder={field.placeholder}
                  className={style.textInput}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value);
                    if (field.onChangeFromParent) {
                      field.onChangeFromParent(e.target.value);
                    }
                    if (field.onChange) {
                      field.onChange(e.target.value);
                    }
                  }}
                />
              </div>
            )}
          </Field>
        );
      case "number":
        return (
          <Field name={field.name}>
            {({ field: formikField, form }: any) => (
              <div className={style.inputFieldWrapper}>
                {field.label && (
                  <label className={style.inputLabel}>{field.label}</label>
                )}
                <input
                  {...formikField}
                  type="number"
                  placeholder={field.placeholder}
                  className={style.numberInput}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value);
                    if (field.onChangeFromParent) {
                      field.onChangeFromParent(e.target.value);
                    }
                    if (field.onChange) {
                      field.onChange(e.target.value);
                    }
                  }}
                />
              </div>
            )}
          </Field>
        );
      case "priceRange":
        return (
          <PriceRangeField
            label={field.label}
            priceMin={field.priceMin || ""}
            priceMax={field.priceMax || ""}
            onPriceMinChange={field.onPriceMinChange || (() => {})}
            onPriceMaxChange={field.onPriceMaxChange || (() => {})}
            placeholderMin={field.placeholderMin}
            placeholderMax={field.placeholderMax}
          />
        );
      case "rangeSlider":
        return (
          <DualRangeSlider
            min={field.min || 0}
            max={field.max || 100}
            minValue={field.minValue || field.min || 0}
            maxValue={field.maxValue || field.max || 100}
            step={field.step || 1}
            label={field.label}
            onMinChange={field.onMinChange || (() => {})}
            onMaxChange={field.onMaxChange || (() => {})}
            formatValue={field.formatValue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${style.formComponent} ${className}`}>
      {title && <h2 className={style.formTitle}>{title}</h2>}

      <Formik
        key={JSON.stringify(initialValues)}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        validateOnChange={true}
        onSubmit={onSubmit}
      >
        {({ resetForm }) => {
          return (
            <Form>
              <div className={style.fieldsGrid}>
                {fields.map((field) => {
                  // Показываем поле только если visible не задано или равно true
                  if (field.visible === false) {
                    return null;
                  }

                  const isFullWidth =
                    field.type === "priceRange" || field.type === "rangeSlider";

                  return (
                    <div
                      key={field.name}
                      className={`${style.fieldWrapper} ${isFullWidth ? style.fullWidth : ""}`}
                    >
                      {renderField(field)}
                    </div>
                  );
                })}
              </div>
              {children && typeof children === "function"
                ? children({ resetForm })
                : children}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
