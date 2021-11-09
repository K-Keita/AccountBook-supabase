type Props = {
  text: string;
  onClick: () => void;
}

export const AuthButton = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className="block py-2 my-5 mx-auto w-9/12 text-center text-gray-600 bg-white bg-opacity-80 rounded-sm"
    >
      {props.text}
    </button>
  );
}
