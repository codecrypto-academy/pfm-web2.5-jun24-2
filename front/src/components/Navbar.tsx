import { useEffect } from "react";
import LogoMeta from "../assets/MetaMask.png";
import CheckGreen from "../assets/Check_green_circle.svg";
import { useMetaMask } from "../hooks/useMetaMask";
import { shortenAddress } from "../utils/shortenAddress.ts";

export const Navbar = () => {
  const { account, connectMetaMask, setAccount } = useMetaMask();
  useEffect(() => {
     window.ethereum.on("accountsChanged", (accounts: string[]) => {
       setAccount(accounts[0]);
     });
  }, [account, setAccount]);

  return (
    <nav className=" flex w-[100%] justify-between bg-[#32e4f0] p-2 fixed z-50 box-shadow-nav">
      <div className="flex justify-center items-center">
        <h1 className="text-white text-xs md:text-xl font-bold">
          THE FAUCET FOR ENTERPRISE
        </h1>
      </div>
      <div className="flex gap-3">
        <button
          className={`text-white text-xs md:text-xl font-bold border-b-2 border-[#fff] ${
            account ? "cursor-auto" : "cursor-pointer"
          } hover:text-[#155163] hover:border-[#155163]`}
          onClick={connectMetaMask}
        >
          {account ? shortenAddress(account) : "CONNECT METAMASK"}
        </button>
        <div className="relative w-8 h-8">
          {account && (
            <img
              src={CheckGreen}
              alt=""
              className="w-3 h-3 absolute top-[20px] rigth-[1px]"
            />
          )}
          <img src={LogoMeta} alt="MetaMask logo" className="w-8 h-8" />
        </div>
      </div>
    </nav>
  );
};
