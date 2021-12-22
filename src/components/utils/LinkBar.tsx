import Link from 'next/link';

type Props = {
  href: string;
  icon: JSX.Element;
  text: string;
};

export const LinkBar = (props: Props) => {
  return (
    <Link href={props.href} passHref>
      <div className="group flex p-1 my-5 mx-auto w-11/12 border-b cursor-pointer">
        {props.icon}
        <p className="mt-1 text-xl text-center group-hover:text-flower">{props.text}</p>
      </div>
    </Link>
  );
}
