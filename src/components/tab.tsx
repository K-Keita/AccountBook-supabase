import { Tab } from "@headlessui/react";
import { Auth } from "@supabase/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { createRef, useCallback, useEffect, useRef,useState } from "react";
import { AddItem } from "src/components/addItem";
import { ItemList } from "src/components/itemList";
import { sortData } from "src/hooks/sortData";
import type { Data } from "src/interface/type";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";
// import throttle from "lodash.throttle";


const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();

type Props = {
  category: number;
};

const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

export const TabList = (props: Props) => {
  const [isTop, setIsTop] = useState<boolean>(false);

  useEffect(() => {
    const scrollAction = () => {
      if (window.scrollX > 100) {
        setIsTop(true);
      } else {
        setIsTop(false);
      }
    };
    window.addEventListener("scroll", scrollAction, {
      capture: false,
      passive: true,
    });
    scrollAction();

    return () => {
      window.removeEventListener("scroll", scrollAction);
    };
  }, []);


//   const ref = useRef(null);
//   useEffect(() => {
// console.log(ref);
//   },[])

//   console.log(isTop);
  return (
    <Tab
    // ref={ref}
      disabled={props.category > day}
      className={({ selected }) => {
        return classNames(
          `min-w-lg py-2.5 text-lg font-semibold leading-5 rounded-lg ${
            props.category > day ? "text-gray-400" : "text-blue-600"
          }`,
          // "focus:outline-none focus:ring-1 ring-offset-1 ring-offset-blue-400 ring-white ring-opacity-60",
          "focus:outline-none focus:ring-1 ring-opacity-60",
          selected
            ? "shadow bg-selected bg-opacity-50"
            : `${
                props.category > day
                  ? ""
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              }`
        );
      }}
    >
      {props.category}
    </Tab>
  );
};
