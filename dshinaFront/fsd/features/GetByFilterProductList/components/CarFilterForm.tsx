"use client";
import { FormComponent } from "../../../shared/ui/FormComponent";
import { useCarFilterForm } from "../hooks/useCarFilterForm";
import style from "../GetProductListForm.module.scss";
import { ButtonComponent } from "../../../shared/ui/Button";

interface CarFilterFormProps {
  hookData?: ReturnType<typeof useCarFilterForm>;
}

export const CarFilterForm: React.FC<CarFilterFormProps> = ({ hookData }) => {
  const fallbackData = useCarFilterForm();
  const data = hookData || fallbackData;
  const { formValues, fieldsConfig, resetFilters } = data;

  return (
    <div className={style.formContainer}>
      <FormComponent
        fields={fieldsConfig}
        initialValues={formValues}
        title="🚗 Подбор шин по автомобилю"
      >
        {({ resetForm }) => (
          <ButtonComponent
            variant="filled"
            text="Сбросить Фильтр"
            onClick={() => {
              resetFilters();
              resetForm();
            }}
          />
        )}
      </FormComponent>
    </div>
  );
};
