import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex gap-4 justify-center py-6 text-gray-600 bg-gray-200">
      <Link href="/">
        <a>
          <div className="p-2 text-lg bg-blue-100">家計簿</div>
        </a>
      </Link>
      <Link href="/">
        <a className="text-4xl text-center">
          <h1 className="pt-2 m-2">Manga List</h1>
        </a>
      </Link>
    </header>
  );
};
