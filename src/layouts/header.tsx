import Link from "next/link";
import { client } from "src/libs/supabase";

export const Header = () => {
  return (
    <header className="hidden fixed top-0 z-30 justify-between py-3 px-5 w-full h-16 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-800 sm:flex">
      <Link href="/">
        <a className="text-3xl">
          <h2 className="font-bold text-white shadow">-Title-</h2>
        </a>
      </Link>
      <button
        className="text-white hover:text-blue-500"
        onClick={() => {
          return client.auth.signOut();
        }}
      >
        Sign Out
      </button>
    </header>
  );
};
