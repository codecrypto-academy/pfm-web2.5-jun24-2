import { DeleteNetworkModal } from "../components/DeleteNetworkModal";
import { MainMenu } from "../components/MainMenu";
import { useAppContext } from "../hooks/useAppContext";

export const Methods = () => {
  const { isModalDelete } = useAppContext();
  return (
    <>
      {isModalDelete && <DeleteNetworkModal />}
      <div>
        <MainMenu />
      </div>
    </>
  );
};
