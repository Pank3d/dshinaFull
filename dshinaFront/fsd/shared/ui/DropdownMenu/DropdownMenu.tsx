"use client";
import React, { ReactNode } from "react";
import { Menu, Button } from "@mantine/core";
import style from "./DropdownMenu.module.scss";

interface DropdownMenuProps {
  trigger?: ReactNode;
  children: ReactNode;
  width?: number | "target";
  activator?: string | ReactNode;
  position?:
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "top-end"
    | "top-start"
    | "top";
  shadow?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  width = "target",
  position = "bottom-end",
  shadow = "md",
  activator,
}) => {
  return (
    <Menu shadow={shadow} width={width} position={position}>
      <Menu.Target>
        {trigger || (
          <Button variant="subtle" className={style.defaultTrigger}>
            {activator}
          </Button>
        )}
      </Menu.Target>

      <Menu.Dropdown>
        <div className={style.dropdownContent}>{children}</div>
      </Menu.Dropdown>
    </Menu>
  );
};
