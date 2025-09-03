"use client";
import React from "react";
import style from "./PriceRangeField.module.scss";

interface PriceRangeFieldProps {
  label: string;
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
  placeholderMin?: string;
  placeholderMax?: string;
}

export const PriceRangeField: React.FC<PriceRangeFieldProps> = ({
  label,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  placeholderMin = "От",
  placeholderMax = "До",
}) => {
  return (
    <div className={style.priceRangeField}>
      <label className={style.label}>{label}</label>
      <div className={style.inputContainer}>
        <input
          type="number"
          value={priceMin}
          onChange={(e) => onPriceMinChange(e.target.value)}
          placeholder={placeholderMin}
          className={style.priceInput}
          min="0"
        />
        <span className={style.separator}>—</span>
        <input
          type="number"
          value={priceMax}
          onChange={(e) => onPriceMaxChange(e.target.value)}
          placeholder={placeholderMax}
          className={style.priceInput}
          min="0"
        />
        <span className={style.currency}>₽</span>
      </div>
    </div>
  );
};
