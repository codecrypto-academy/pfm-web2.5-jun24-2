import { MainMenu } from "../components/MainMenu";
import { useNetwork } from "../hooks/useNetwork";

export const Methods = () => {
  const { createNetwork } = useNetwork();
  return (
    <div>
      <MainMenu />
      <button onClick={createNetwork}>Create Network</button>
    </div>
  );
}
