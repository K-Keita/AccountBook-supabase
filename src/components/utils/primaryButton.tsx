type Props = {
  text: string;
  type: "button" | "submit" | "reset";
  onClick: () => void;
}

export const PrimaryButton = (props: Props) => {
  return (
    <button
      className="table py-1 px-3 text-sm hover:bg-flower rounded-lg border border-flower hover:border-white cursor-pointer"
      onClick={props.onClick}
      type={props.type}
    >
      {props.text}
    </button>
  );
}
