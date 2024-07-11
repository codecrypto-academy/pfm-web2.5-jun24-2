import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Network } from "../interfaces/networkType";
import EditNetwork from "./EditNetwork";
import { Table } from "./Table";

const fetchNetworks = async () => {
  const { data } = await axios.get("http://localhost:3000/api/networks");
  return data;
};

export const ListNetworks: React.FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["networks"],
    queryFn: fetchNetworks,
  });
  const [showEdit, setShowEdit] = useState(false);

  const { setNetworks, networks } = useAppContext();

  useEffect(() => {
    if (!data) return;

    const networkArray: Network[] = Object.values(data);

    setNetworks(networkArray);
  }, [data, setNetworks]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;
  const toggleEdit = () => {
    setShowEdit(true);
  };
  const handleBack = () => {
    setShowEdit(false);
  };

  return (
    <>
      {showEdit && (
        <div className="slide-in flex justify-center">
          <EditNetwork onBack={handleBack} />
        </div>
      )}
      <div className="w-full flex justify-center mb-5">
        {!showEdit && (
        <button
          className="bg-[#32e4f0] h-11 text-white mt-7 p-2 w-96 text-center m-auto"
          onClick={toggleEdit}
        >
          ADD NETWORK
        </button>)}
      </div>
      {networks.length === 0 && <h3 className="text-center mt-10 text-3xl text-white m-auto"
      > THERE ARE NO NETWORKS TO DISPLAY, PLEASE ADD A NETWORK
        </h3>}
      {networks.length > 0 && <Table networks={networks} />}
    </>
  );
};
