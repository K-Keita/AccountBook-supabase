import { LinkButton } from "src/components/utils/linkButton";

import { LinkBar } from "./utils/LinkBar";

export const LinkButtonList = () => {
  return (
    <>
      <div className="flex justify-around py-2 my-2 sm:hidden">
        <LinkButton
          href="/category"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-4 w-8 h-8 group-hover:text-flower group-hover:animate-rotate-90-ccw"
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
          }
          text={"Category"}
        />
        <LinkButton
          href="/chart"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-4 w-8 h-8 group-hover:text-flower group-hover:animate-flip-vertical-right"
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
                strokeWidth={1.3}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
          }
          text="Chart"
        />
        <LinkButton
          href="/setting"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-4 w-8 h-8 group-hover:text-flower group-hover:animate-rotate-center"
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
          }
          text="Setting"
        />
      </div>
      <div className="hidden sm:block">
        <LinkBar
          href="/"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-4 w-8 h-8 group-hover:text-flower group-hover:animate-wobble-hor-bottom"
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
          }
          text="Home"
        />
        <LinkBar
          href="/category"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-4 w-8 h-8 group-hover:text-flower group-hover:animate-rotate-90-ccw"
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
          }
          text={"Category"}
        />
        <LinkBar
          href="/chart"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-4 w-8 h-8 group-hover:text-flower group-hover:animate-flip-vertical-right"
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
                strokeWidth={1.3}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
          }
          text="Chart"
        />
      </div>
    </>
  );
};
