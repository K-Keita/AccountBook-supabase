import { Button, IconLogOut } from "@supabase/ui";
import Link from "next/link";
import { client } from "src/libs/supabase";

export const Header = () => {
  return (
    <header className="flex justify-between p-5 h-20">
      <Link href="/">
        <a className="text-3xl">
          <h2 className="font-bold text-white text-shadow" >-Title-</h2>
        </a>
      </Link>
      <div className="text-blue-600">

      <Button
        size="tiny"
        type="text"
        className="text-blue-600"
        icon={<IconLogOut />}
        onClick={() => {
          return client.auth.signOut();
        }}
        >
        Sign Out
      </Button>
        </div>
    </header>
  );
};
