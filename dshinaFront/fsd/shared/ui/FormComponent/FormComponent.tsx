"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ReactNode } from "react";
import SelectComponent from "../Select/Select";
import style from "./FormComponent.module.scss";

export interface FieldConfig {
  name: string;
  label: string;
  type: "select" | "text" | "number";
  placeholder?: string;
  data?: Array<{ label: string; value: string | number }>;
  onChangeFromParent?: (value: any) => void;
  onChange?: (value: any) => void;
  onReset?: () => void;
  searchable?: boolean;
  disabled?: boolean;
  validation?: Yup.StringSchema | Yup.NumberSchema;
}

export interface FormComponentProps {
  fields: FieldConfig[];
  initialValues: Record<string, any>;
  title?: string;
  onSubmit?: (values: Record<string, any>) => void;
  className?: string;
  children?: ReactNode | ((formikProps: { resetForm: () => void }) => ReactNode);
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
    fields.reduce((schema, field) => {
      if (field.validation) {
        schema[field.name] = field.validation;
      }
      return schema;
    }, {} as Record<string, any>)
  );

  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case "select":
        return (
          <Field
            name={field.name}
            component={SelectComponent}
            label={field.label}
            placeholder={field.placeholder || `Выберите ${field.label.toLowerCase()}`}
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
          <Field
            name={field.name}
            type="text"
            placeholder={field.placeholder}
            className={style.textInput}
            onChange={field.onChange}
          />
        );
      case "number":
        return (
          <Field
            name={field.name}
            type="number"
            placeholder={field.placeholder}
            className={style.numberInput}
            onChange={field.onChange}
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
                {fields.map((field) => (
                  <div key={field.name} className={style.fieldWrapper}>
                    {renderField(field)}
                  </div>
                ))}
              </div>
              {children && typeof children === 'function' ? children({ resetForm }) : children}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};