import { useEffect } from "react";
import { Menu } from "../components/Menu";
import { useMenu } from "../hooks/useMenu";
import  EditNetwork  from "./EditNetwork";
import { Faucet } from "./Faucet";
import { ListNetworks } from "./NetworkList";


export const MainMenu = () => {
  const { menuItems, setMenuItems } = useMenu("NODE");
  useEffect(() => {
    console.log(menuItems);
  }, [menuItems]);

  const changeMenu = (menu: string) => {
    setMenuItems(menu);
  };

  return (
    <main className="bg-[#155163]  flex justify-center items-center flex-col pb-[25px] h-screen">
      <Menu typeofMenu={menuItems} changeMenu={changeMenu} />
<<<<<<< HEAD
=======
      {menuItems === "NODE" && <Network setMenuItems={setMenuItems}/>}
>>>>>>> 6455c19 (vistas front)
      {menuItems === "FAUCET" && <div><Faucet /></div>}
      {menuItems === "LISTNETWORK" && <div><ListNetworks setMenuItems={setMenuItems}/></div>}
      
    </main>
  );
};