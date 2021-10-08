import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { RingLoader } from "react-spinners";
import { BookList } from "src/components/bookList";
import { Title } from "src/components/titleList";

type Props = {
  title: Title;
  setDescription: Dispatch<SetStateAction<string>>;
};

export const SearchSubtitle = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>(props.title.title);
  const [bookList, setBookList] = useState<any>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="mt-4 ml-4">
      <div className="w-full bg-blue-50 rounded-2xl">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-500 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
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
                    className="w-full h-10 col-span-5 p-2 bg-white border border-gray-300 rounded shadow appearance-none hover:border-gray-700"
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
          )}
        </Disclosure>
      </div>
    </div>
  );
};
