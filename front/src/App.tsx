import { MainMenu } from "./components/MainMenu";
import { Navbar } from "./components/Navbar";
import logoEthereum from "./assets/logoEthereum.png";

function App() {
  return (
    <div>
      <Navbar />
      <header className="bg-[#155163] w-screen h-screen flex justify-center items-center flex-col">
        <div className="flex w-[90vw] m-auto flex-wrap justify-center items-center">
          <div className=" w-96 flex flex-col gap-4">
            <h1 className="text-white text-4xl">THE FAUCET FOR ENTERPRICE</h1>
            <p className="text-white">
              This is a faucet for the enterprise, it is a simple application
              that allows you to get some tokens for your enterprise. It is a
              simple application that allows you to get some tokens for your
              enterprise. It is a simple application that allows you to get some tokens for your enterprise.
            </p>
            <button className="bg-[#32e4f0] h-11 text-white w-36">
              GET STARTED
            </button>
          </div>
          <img src={logoEthereum} alt="" />
        </div>
      </header>
      <MainMenu />
    </div>
  );
}

export default App;
