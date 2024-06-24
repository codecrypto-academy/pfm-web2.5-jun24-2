import { useEffect } from "react";
import { Menu } from "../components/Menu";
import { Network } from "../components/Network";
import { useMenu } from "../hooks/useMenu";

export const MainMenu = () => {
  const { menuItems, setMenuItems } = useMenu("NODE");
  useEffect(() => {
    console.log(menuItems);
  }, [menuItems]);
  const changeMenu = (menu: string) => {
    setMenuItems(menu);
  };
  return (
    <main className="bg-[#155163] w-screen h-screen flex justify-center items-center flex-col">
      <Menu typeofMenu={menuItems} changeMenu={changeMenu} />
      {menuItems === "NODE" && <Network />}
      {menuItems === "FAUCET" && <div>FAUCET</div>}
      {menuItems === "ALLOC" && <div>ALLOC</div>}
    </main>
  );
};
