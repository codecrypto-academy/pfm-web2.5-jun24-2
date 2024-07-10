import { useMetaMask } from "../hooks/useMetaMask";

export function Faucet() {
  const { account } = useMetaMask();

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(account);
  };
  if (!account) {
    return <button>Connect MetaMask</button>;
  } else {
    return (
      <form onSubmit={onSubmit} className="flex flex-col">
        <input type="text" placeholder="Enter your address" />
        <button type="submit" className="bg-red-300">Get Ether</button>
      </form>
    );
  }
}
