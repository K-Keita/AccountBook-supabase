import Link from 'next/link';

type Props = {
  href: string;
  icon: JSX.Element;
  text: string;
};

export const LinkBar = (props: Props) => {
  return (
    <Link href={props.href} passHref>
      <div className="group flex p-1 my-2 mx-auto w-11/12 border-b cursor-pointer">
        {props.icon}
        <p className="text-lg text-center group-hover:text-flower">{props.text}</p>
      </div>
    </Link>
  );
}
