import { useState } from "react";
import { Button } from "./Button";

export const Network = () => {
  const listOfNetworks = ["Network 1", "Network 2", "Network 3"];
  const initialStatuses = listOfNetworks.map(() => "Down");
  const [statuses, setStatuses] = useState(initialStatuses);

  const handleStatus = (index: unknown) => {
    if(typeof index === "number"){
      const newStatuses = [...statuses];
      newStatuses[index] = newStatuses[index] === "UP" ? "DOWN" : "UP";
      setStatuses(newStatuses);

    }
  };

  return (
      <div>
        {listOfNetworks.map((network, index) => (
          <div className="flex justify-center items-center gap-4 m-5 flex-wrap " key={
            network
          }>
          <div className="flex gap-4 w-60">
            <Button typeOfButton="primary" text="UP" />
            <Button typeOfButton="secondary" text="DOWN" />
          </div>
          <p className="text-white text-2xl">{network}</p>
          <p
            className={`${
              statuses[index] === "UP" ? "text-green-500" : "text-red-500"
            }`}
          >
            {statuses[index]}
          </p>
          <button
            onClick={() => handleStatus(index)}
            className="bg-[#32e4f0] h-11 text-white w-36"
          >
            CHANGE STATUS
          </button>
        </div>
      ))}
    </div>
  );
};
