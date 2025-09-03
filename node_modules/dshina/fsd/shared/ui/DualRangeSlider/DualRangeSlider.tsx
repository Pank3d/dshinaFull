"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import style from "./DualRangeSlider.module.scss";

interface DualRangeSliderProps {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  step?: number;
  label?: string;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min,
  max,
  minValue,
  maxValue,
  step = 1,
  label,
  onMinChange,
  onMaxChange,
  formatValue = (value) => value.toString(),
}) => {
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  const getValue = useCallback(
    (percent: number) => {
      const value = (percent / 100) * (max - min) + min;
      return Math.round(value / step) * step;
    },
    [min, max, step]
  );

  const handleMouseDown =
    (type: "min" | "max") => (event: React.MouseEvent) => {
      event.preventDefault();
      setIsDragging(type);
    };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.min(
        100,
        Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)
      );
      const newValue = getValue(percent);

      if (isDragging === "min") {
        const clampedValue = Math.min(newValue, maxValue - step);
        if (clampedValue >= min && clampedValue !== minValue) {
          onMinChange(clampedValue);
        }
      } else if (isDragging === "max") {
        const clampedValue = Math.max(newValue, minValue + step);
        if (clampedValue <= max && clampedValue !== maxValue) {
          onMaxChange(clampedValue);
        }
      }
    },
    [
      isDragging,
      getValue,
      minValue,
      maxValue,
      step,
      min,
      max,
      onMinChange,
      onMaxChange,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const minPercent = getPercent(minValue);
  const maxPercent = getPercent(maxValue);

  return (
    <div className={style.sliderContainer}>
      {label && <label className={style.label}>{label}</label>}

      <div className={style.valuesDisplay}>
        <span className={style.value}>От: {formatValue(minValue)}</span>
        <span className={style.value}>До: {formatValue(maxValue)}</span>
      </div>

      <div className={style.sliderWrapper} ref={sliderRef}>
        <div className={style.sliderTrack}>
          <div
            className={style.sliderRange}
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </div>

        <div
          className={`${style.sliderThumb} ${style.sliderThumbMin} ${
            isDragging === "min" ? style.dragging : ""
          }`}
          style={{ left: `${minPercent}%` }}
          onMouseDown={handleMouseDown("min")}
        />

        <div
          className={`${style.sliderThumb} ${style.sliderThumbMax} ${
            isDragging === "max" ? style.dragging : ""
          }`}
          style={{ left: `${maxPercent}%` }}
          onMouseDown={handleMouseDown("max")}
        />
      </div>

      <div className={style.minMaxLabels}>
        <span className={style.minLabel}>{formatValue(min)}</span>
        <span className={style.maxLabel}>{formatValue(max)}</span>
      </div>
    </div>
  );
};
