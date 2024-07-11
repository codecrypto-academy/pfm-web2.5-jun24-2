import { TrashIcon } from "@heroicons/react/24/solid";
import { Loader } from "./Loader";
import { Success } from "./Success";
import { useEffect } from "react";
import { useNodes } from "../hooks/useNodes";
import { useParams } from "react-router-dom";

export const DeleteNodeModal = () => {
  const { deleteNode, closeModalDeleteNode, loader, setLoader, nodeId } =
    useNodes();
    const { id } = useParams<{ id: string }>();

  useEffect(() => {
    setLoader("OFF");
  }, [nodeId, setLoader]);

  return (
    <>
      <div
        className="w-screen h-screen fixed bg-black opacity-[0.5] z-[8000] top-[50%] left-[50%]"
        style={{ transform: "translate(-50%, -50%)" }}
      ></div>
      <div className=" fixed inset-0 z-[9999] overflow-y-auto animation-modal">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-[#155163] px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-[500px] sm:p-6">
            <div className="flex justify-center items-center">
              <TrashIcon
                title="edit"
                color="#32e4f0"
                titleId="edits"
                className="block h-10 w-10 mr-3"
                aria-hidden="true"
              />

              <h3 className="font-bold text-4xl text-white text-center">
                ARE YOU SURE?
              </h3>
            </div>
            <div className=" gap-4 flex items-center flex-wrap justify-center mt-5">
              <button
                className="bg-[#32e4f0] p-2 w-40 text-center text-white font-bold flex justify-center items-center"
                onClick={()=> deleteNode(id ?? '')}
              >
                {loader === "ON" && <Loader />}
                {loader === "SUCCESS" && <Success />}
                {loader === "OFF" && "DELETE"}
              </button>

              <button
                className=" font-text border-[#32e4f0] border-2  p-2 w-40 text-center font-bold text-white"
                onClick={closeModalDeleteNode}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
