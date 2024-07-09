import { useEffect } from "react";
import { Menu } from "../components/Menu";
import { useMenu } from "../hooks/useMenu";
import { Faucet } from "./Faucet";
import { ListNetworks } from "./NetworkList";


export const MainMenu = () => {
  const { menuItems, setMenuItems } = useMenu("LISTNETWORK");
  useEffect(() => {
    console.log(menuItems);
  }, [menuItems]);

  const changeMenu = (menu: string) => {
    setMenuItems(menu);
  };

  return (
    <main className="bg-[#155163]  flex justify-center items-center flex-col pb-[25px] h-screen">
      <Menu typeofMenu={menuItems} changeMenu={changeMenu} />
      {menuItems === "FAUCET" && <div><Faucet /></div>}
      {menuItems === "LISTNETWORK" && <div><ListNetworks/></div>}
      
    </main>
  );
};