import { useState } from "react";

export const useMenu = (typeofMenu: string) => {
  const [menuItems, setMenuItems] = useState(typeofMenu);

  return {
    menuItems,
    setMenuItems,
  }
};
