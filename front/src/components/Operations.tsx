export function Operations ({ setMenuItems }) {



    return (
        <div>
            <h1>Operations</h1>
            <div className="bg-blue-100 p-2 rounded-md">
      <div className="flex justify-between items-center">
        <button className="text-blue-700 hover:text-blue-900 font-semibold pr-5" onClick={() => setMenuItems("FAUCTE")}>faucet</button>
        <button className="text-blue-700 hover:text-blue-900 font-semibold pr-5" >transfer</button>
        <button className="text-blue-700 hover:text-blue-900 font-semibold pr-5">up</button>
        <button className="text-blue-700 hover:text-blue-900 font-semibold pr-5">down</button>
        <button className="text-blue-700 hover:text-blue-900 font-semibold pr-5">restart</button>
        <button className="text-blue-700 hover:text-blue-900 font-semibold pr-5">blocks</button>
      </div>
    </div>
        </div>
    );
};