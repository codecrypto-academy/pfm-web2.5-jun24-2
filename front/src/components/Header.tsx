import logoEthereum from "../assets/logoEthereum.png";

export const Header = () => {
  return (
    <main className="bg-[#155163] pt-9 flex justify-center items-center flex-col">
      <div className="flex  m-auto flex-wrap justify-center items-center pt-32 pb-1">
        <div className=" flex flex-col gap-4 w-[40%] h-[50vh]">
          <h1 className="text-white text-4xl">THE FAUCET FOR ENTERPRISE</h1>
          <p className="text-white">
            This is a faucet for the enterprise, it is a simple application that
            allows you to get some tokens for your enterprise. It is a simple
            application that allows you to get some tokens for your enterprise.
            It is a simple application that allows you to get some tokens for
            your enterprise.
          </p>
          <button className="bg-[#32e4f0] h-11 text-white w-36">
            GET STARTED
          </button>
        </div>
        <img src={logoEthereum} alt="" className=" w-56" />
      </div>
    </main>
  );
};
