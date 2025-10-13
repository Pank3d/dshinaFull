import React from "react";
import Link from "next/link";
import { navBarConfig } from "../config/navBarConfig";
import style from "./NavBar.module.scss";

export const NavBar = () => {
  return (
    <nav className={style.navBar}>
      <ul className={style.navList}>
        {navBarConfig.map((item) => (
          <li key={item.href} className={style.navItem}>
            <Link href={item.href} className={style.navLink}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
