type Props = {
  text: string | JSX.Element;
  type: "button" | "submit" | "reset";
  onClick: () => void;
}

export const PrimaryButton = (props: Props) => {
  return (
    <button
      className="table py-1 px-3 text-sm bg-gradient-to-r hover:bg-gradient-to-r from-pink-400 hover:from-blue-600 via-flower to-indigo-500 hover:to-pink-600 rounded-lg border border-flower hover:border-white transition duration-500 ease-in-out transform hover:scale-110 hover:-translate-y-1 cursor-pointer"
      onClick={props.onClick}
      type={props.type}
    >
      {props.text}
    </button>
  );
}
