import Link from "next/link";

type Props = {
  href: string;
  icon: JSX.Element;
  text: string;
};

export const LinkButton = (props: Props) => {
  return (
    <Link href={props.href} passHref>
      <div className="cursor-pointer">
        {props.icon}
        <p className="text-center text-sm">{props.text}</p>
      </div>
    </Link>
  );
};
