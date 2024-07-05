import { useEffect } from "react";
import { Menu } from "../components/Menu";
import { Network } from "../components/Network";
import { useMenu } from "../hooks/useMenu";
import  EditNetwork  from "./EditNetwork";
import { Faucet } from "./Faucet";
import { NetworkList } from "./NetworkList";


export const MainMenu = () => {
  const { menuItems, setMenuItems } = useMenu("NODE");
  useEffect(() => {
    console.log(menuItems);
  }, [menuItems]);

  const changeMenu = (menu: string) => {
    setMenuItems(menu);
  };

  return (
    <main className="bg-[#155163]  flex justify-center items-center flex-col pb-[25px]">
      <Menu typeofMenu={menuItems} changeMenu={changeMenu} />
      {menuItems === "NODE" && <Network />}
      {menuItems === "FAUCET" && <div><Faucet /></div>}
      {menuItems === "LISTNETWORK" && <div><NetworkList /></div>}
      {menuItems === "EDITNETWORK" && <div><EditNetwork /></div>}
    </main>
  );
};