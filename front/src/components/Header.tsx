import { Link } from "react-router-dom";
import logoEthereum from "../assets/logoEthereum.png";

export const Header = () => {
  return (
    <header className="bg-[#155163] flex justify-center items-center flex-col overflow-x-hidden pb-3 md:pb-0">
      <div className="flex justify-center items-center min-h-screen flex-wrap text-center pt-12 gap-6 overflow-y-auto animation-modal">
        <div className=" flex flex-col justify-center w-[90%] items-center max-w-[500px] md:justify-start md:items-start md:text-start gap-11">
          <h1 className="text-white text-4xl font-bold">
            THE FAUCET FOR ENTERPRISE
          </h1>
          <p className="text-white">
            Welcome to "THE FAUCET FOR ENTERPRISE," the ideal platform for
            companies that need to easily create and manage customized network
            nodes. Our solution enables centralized supervision and the use of
            integrated faucets to facilitate testing and development, offering
            scalability, advanced security, and operational efficiency. Optimize
            your resources and take your network management to the next level
            with our intuitive and powerful platform.
          </p>
          <Link to="/methods">
            <button className="bg-[#32e4f0] h-11 text-white w-36 font-bold">
              GET STARTED
            </button>
          </Link>
        </div>
        <img src={logoEthereum} alt="" className=" w-60" />
      </div>
    </header>
  );
};
