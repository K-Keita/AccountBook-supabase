import { LinkButton } from "src/components/utils/linkButton";

export const MenuBar = () => {
  const menu = [
    {
      href: "/",
      icon: (
        // <svg
        //   xmlns="http://www.w3.org/2000/svg"
        //   className="mx-4 w-8 h-8"
        //   fill="none"
        //   viewBox="0 0 24 24"
        //   stroke="currentColor"
        // >
        //   <path
        //     strokeLinecap="round"
        //     strokeLinejoin="round"
        //     strokeWidth={1}
        //     d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        //   />
        // </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-4 w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      text: "Home",
    },
    {
      href: "/category",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-4 w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      text: "Category",
    },
    {
      href: "/chart",
      icon: (
        // <svg
        //   xmlns="http://www.w3.org/2000/svg"
        //   className="mx-4 w-8 h-8"
        //   viewBox="0 0 20 20"
        //   fill="currentColor"
        // >
        //   <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
        //   <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        // </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-4 w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
          />
        </svg>
      ),
      text: "Chart",
    },
    {
      href: "/setting",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-4 w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      text: "Setting",
    },
  ];

  return (
    <div className="flex fixed bottom-0 left-1 z-50 justify-around py-2 w-full bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900">
      {menu.map((value) => {
        return (
          <LinkButton
            key={value.text}
            href={value.href}
            icon={value.icon}
            text={value.text}
          />
        );
      })}
    </div>
  );
};
