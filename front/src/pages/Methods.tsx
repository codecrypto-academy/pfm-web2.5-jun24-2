import { DeleteNetworkModal } from "../components/DeleteNetworkModal";
import { MainMenu } from "../components/MainMenu";
import { useAppContext } from "../hooks/useAppContext";
import { useNetwork } from "../hooks/useNetwork";

export const Methods = () => {
  const { isModalDelete } = useAppContext();
  const { createNetwork } = useNetwork();
  return (
    <>
      {isModalDelete && <DeleteNetworkModal />}
      <div>
        <MainMenu />
        <button onClick={createNetwork}>createNetwork</button>
      </div>
    </>
  );
};
