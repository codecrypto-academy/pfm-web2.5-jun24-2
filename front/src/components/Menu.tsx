
export const Menu = ({ typeofMenu = "NODE", changeMenu }: { typeofMenu: string, changeMenu: (menu: string) => void }) => {
  return (
<<<<<<< HEAD
    <div className="bg-[#32e4f0] w-screen p-9 flex justify-center gap-7">
      <button
        onClick={() => {
          changeMenu("EDITNETWORK");
        }}
        className={`text-4xl ${
          typeofMenu === "EDITNETWORK"
            ? "text-[#155163] border-b-4 border-[#155163]"
            : "text-white"
        }`}
      >
        ADD NETWORK
      </button>

=======
    <div className="bg-[#32e4f0] w-screen p-9 flex justify-center gap-7 flex-wrap">
>>>>>>> feature/nav
      <button
        onClick={() => {
          changeMenu("FAUCET");
        }}
        className={`text-4xl ${
          typeofMenu === "FAUCET"
            ? "text-[#155163] border-b-4 border-[#155163]"
            : "text-white"
        }`}
      >
        FAUCET
      </button>

      <button
        onClick={() => {
          changeMenu("NODE");
        }}
        className={`text-4xl ${
          typeofMenu === "NODE"
            ? "text-[#155163] border-b-4 border-[#155163]"
            : "text-white"
        }`}
      >
        NODE
      </button>

      <button
        onClick={() => {
          changeMenu("LISTNETWORK");
        }}
        className={`text-4xl ${
          typeofMenu === "LISTNETWORK"
            ? "text-[#155163] border-b-4 border-[#155163]"
            : "text-white"
        }`}
      >
        LIST NETWORK
      </button>

      <button
        onClick={() => {
          changeMenu("OPERATIONS");
        }}
        className={`text-4xl ${
          typeofMenu === "OPERATIONS"
            ? "text-[#155163] border-b-4 border-[#155163]"
            : "text-white"
        }`}
      >
        OPERATIONS
      </button>
    </div>
  );
};
