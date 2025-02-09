
export const Menu = ({ typeofMenu = "NODE", changeMenu }: { typeofMenu: string, changeMenu: (menu: string) => void }) => {
  return (
    <div className="bg-[#32e4f0] w-[100%] p-9 flex justify-center gap-7 flex-wrap">
          

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
        NETWORKS
      </button>

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
    </div>
  );
};
