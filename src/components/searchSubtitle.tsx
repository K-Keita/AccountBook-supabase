import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import type { Dispatch, SetStateAction } from "react";
import { useRef, useState } from "react";
import { RingLoader } from "react-spinners";
import { BookList } from "src/components/bookList";
import type { Data } from "src/components/titleList";

type Props = {
  title: Data;
  setDescription: Dispatch<SetStateAction<string>>;
};

export const SearchSubtitle = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const [bookList, setBookList] = useState<any>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="mt-4 ml-4">
      <div className="w-full bg-blue-50 rounded-2xl">
        <Disclosure>
          {({ open }) => {
            return (
              <>
                <Disclosure.Button
                  className="flex justify-between py-2 px-4 w-full text-sm font-medium text-left text-blue-500 bg-blue-100 hover:bg-blue-200 rounded-lg focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 focus:outline-none"
                  ref={buttonRef}
                >
                  <span>Search ISBN number by title.</span>
                  <ChevronUpIcon
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-blue-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="p-4 text-gray-500 text-md">
                  <div className="grid grid-cols-6 gap-2">
                    <input
                      className="col-span-5 p-2 w-full h-10 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                      value={text}
                      onChange={(e) => {
                        return setText(e.target.value);
                      }}
                    />
                  </div>
                  {isLoading ? (
                    <div>
                      <div className="flex justify-center mt-4">
                        <RingLoader color="#aaddff" size={50} />
                      </div>
                      <p className="text-center">Loading...</p>
                    </div>
                  ) : (
                    <BookList
                      bookList={bookList}
                      setDescription={props.setDescription}
                      close={buttonRef}
                    />
                  )}
                </Disclosure.Panel>
              </>
            );
          }}
        </Disclosure>
      </div>
    </div>
  );
};
