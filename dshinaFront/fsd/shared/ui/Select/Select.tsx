import { FieldProps } from "formik";
import { Select } from "@mantine/core";

interface FormikMantineSelectProps extends FieldProps {
  data: { label: string; value: string }[];
  placeholder: string;
  label: string;
  searchable?: boolean;
  disabled?: boolean;
  onChangeFromParent: (value: string) => void;
}

const SelectComponent = ({
  field,
  form,
  data,
  placeholder,
  label,
  searchable,
  disabled,
  onChangeFromParent,
}: FormikMantineSelectProps) => {
  const handleChange = (value: string | null) => {
    form.setFieldValue(field.name, value || '');
    onChangeFromParent(value || '');
  };

  return (
    <Select
      label={label}
      placeholder={placeholder}
      data={data}
      searchable={searchable}
      disabled={disabled}
      value={field.value}
      onChange={(value) => handleChange(value)}
      onBlur={() => form.setFieldTouched(field.name, true)}
      error={form.touched[field.name] && form.errors[field.name]}
    />
  );
};

export default SelectComponent;
