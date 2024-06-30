
export const Menu = ({ typeofMenu = "NODE", changeMenu }: { typeofMenu: string, changeMenu: (menu: string) => void }) => {
  return (
    <div className="bg-[#32e4f0] w-screen p-9 flex justify-center gap-7 flex-wrap">
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
          changeMenu("ALLOC");
        }}
        className={`text-4xl ${
          typeofMenu === "ALLOC"
            ? "text-[#155163] border-b-4 border-[#155163]"
            : "text-white"
        }`}
      >
        ALLOC
      </button>
    </div>
  );
};
