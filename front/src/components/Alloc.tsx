/*export const Alloc = () => {
  return (
    <div>Alloc</div>
  )
}*/

import { NetworkList } from "./NetworkList";

function MenuList({setMenuItems}) {
  
  
  return (

    <div className="container">
      <ul className="nav-item active">
        <a className="nav-link" href="./NetworkList.tsx">
          Networks
        </a>
      </ul>
      <h2>List Networks</h2>
      <button onClick={() => setMenuItems("OPERATION")} >
      Edit Networks
        </button> 
      
      <NetworkList />
    </div>
  );
}

export default MenuList;
