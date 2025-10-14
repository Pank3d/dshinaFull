export interface NavBarItem {
  label: string;
  href: string;
}

export const navBarConfig: NavBarItem[] = [
  {
    label: "Доставка",
    href: "/delivery",
  },
  {
    label: "Поиск",
    href: "/",
  },
];
