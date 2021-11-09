import Image from 'next/image';

type Props = {
  onClick: () => void;
  text: string;
}

export const GoogleButton = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className="flex py-1 px-1 my-6 mx-auto w-9/12 text-center bg-google bg-opacity-50 rounded-sm"
    >
      <div className="p-1 h-8 bg-white rounded-sm">
        <Image
          alt="Google_icon"
          src="/icons/Google.png"
          width={24}
          height={24}
        />
      </div>
      <p className="flex-1 mt-1 text-center">{props.text}</p>
    </button>
  );
}
