import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { client } from "src/libs/supabase";
import {useForm} from 'react-hook-form';

type Props = {
  userData: any;
  getItemList: (year: number, month: number) => void;
};
const d = new Date();

const year = d.getFullYear();
const month = d.getMonth() + 1;

export const AddCategory = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");

  // const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setCategoryName(e.target.value);
  // }, [setCategoryName]);

  const addCategory = async (text: string) => {
    if (text === "") {
      return false;
    }

    if (props.userData) {
      const arr = props.userData.categoryList;
      if (arr.indexOf(text) !== -1) {
        alert("すでに同じカテゴリー名があります");
        return false;
      }
      const newArr = [...arr, text];

      const { error } = await client.from("users").upsert({
        id: props.userData.id,
        userID: props.userData.userID,
        categoryList: newArr,
      });

      if (error) {
        alert(error);
      }
    }

    setCategoryName("");
    setIsOpen(false);
    props.getItemList(year, month);
  };

  const handleOpenCategory = () => {
    setIsOpen(true);
  };

  const handleCloseCategory = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenCategory}
        className="block p-1 my-2 mr-4 ml-auto w-20 text-sm border border-green-400 cursor-pointer"
      >
        追加
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-50"
          onClose={handleCloseCategory}
        >
          <div className="px-4 text-center border-2">
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block overflow-hidden p-6 my-6 w-full align-middle bg-gray-50 rounded-xl border border-gray-300 transition-all transform">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-center text-gray-900"
                >
                  CategoryName
                </Dialog.Title>
                <div className="mt-4">
                  <input
                    className="px-4 h-12 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    placeholder="Filtering text"
                    value={categoryName}
                    autoFocus
                    type="text"
                    onChange={(e) => {
                      return setCategoryName(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-around mt-3">
                  <button
                    onClick={() => {
                      addCategory(categoryName);
                    }}
                    className="table p-1 mx-4 text-sm border border-green-400 cursor-pointer"
                  >
                    change
                  </button>
                  <button
                    onClick={handleCloseCategory}
                    className="table p-1 mx-4 text-sm border border-green-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
