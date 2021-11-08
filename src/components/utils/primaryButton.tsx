type Props = {
  text: string;
  onClick: () => void;
}

export const PrimaryButton = (props: Props) => {
  return (
    <button
      className="table py-1 px-3 text-sm hover:bg-flower rounded-lg border border-flower hover:border-white cursor-pointer"
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
