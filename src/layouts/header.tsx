import { Auth, Button, IconLogOut } from "@supabase/ui";
import Link from "next/link";
import { client } from "src/libs/supabase";

export const Header = () => {
  return (
    <header className="flex justify-between p-5 h-20 border-b border-blue-300">
      <Link href="/">
        <a className="text-3xl">
          <h2 className="text-blue-500">-Title-</h2>
        </a>
      </Link>
      <Button
        size="small"
        icon={<IconLogOut />}
        onClick={() => {
          return client.auth.signOut();
        }}
      >
        Sign Out
      </Button>
    </header>
  );
};
