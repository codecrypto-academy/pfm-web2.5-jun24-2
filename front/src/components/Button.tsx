
export const Button = ({typeOfButton, text}: {typeOfButton: "primary" | "secondary" | "tertiary", text: string}) => {
  if (typeOfButton === "primary") {
    return <button className="bg-[#32e4f0] w-24 h-11 text-white">{text}</button>;
  }
  if (typeOfButton === "secondary") {
    return (
      <button className="bg-[#155163] border-2 border-[#32e4f0] text-[#32e4f0] h-11 w-24">
        {text}
      </button>
    );
  }
  if (typeOfButton === "tertiary") {
    return <button className="bg-[#32e4f0] w-16 h-11">{text}</button>;
  }
};
