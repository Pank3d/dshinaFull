"use client";
import React from "react";
import { ButtonComponent } from "../Button";
import style from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const itemsPerPageOptions = [10, 20, 50, 100];

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  if (totalItems === 0) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={style.paginationContainer}>
      <div className={style.paginationInfo}>
        <span>
          Показано {startItem}-{endItem} из {totalItems} товаров
        </span>
        <div className={style.itemsPerPageSelector}>
          <label htmlFor="itemsPerPage">Показывать по:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className={style.select}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {totalPages > 1 && (
        <div className={style.paginationControls}>
          <ButtonComponent
            variant="outline"
            text="«"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={style.pageButton}
          />

          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className={style.dots}>...</span>
              ) : (
                <ButtonComponent
                  variant={page === currentPage ? "filled" : "outline"}
                  text={String(page)}
                  onClick={() => onPageChange(Number(page))}
                  className={style.pageButton}
                />
              )}
            </React.Fragment>
          ))}

          <ButtonComponent
            variant="outline"
            text="»"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={style.pageButton}
          />
        </div>
      )}
    </div>
  );
};