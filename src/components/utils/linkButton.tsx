import Link from "next/link";

type Props = {
  href: string;
  icon: JSX.Element;
  text: string;
};

export const LinkButton = (props: Props) => {
  return (
    <Link href={props.href} passHref>
      <div className="group p-1 rounded-md cursor-pointer">
        {props.icon}
        <p className="text-sm text-center">{props.text}</p>
      </div>
    </Link>
  );
};
