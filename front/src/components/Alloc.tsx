import { NetworkList } from "./NetworkList";

function MenuList({ setMenuItems }) {
  return (
    <div className="container">
      <button onClick={() => setMenuItems("NODE")}>Networks</button>

      <h2>List Networks</h2>

      <button onClick={() => setMenuItems("OPERATION")}>Edit Networks</button>

      <NetworkList />
    </div>
  );
}

export default MenuList;
