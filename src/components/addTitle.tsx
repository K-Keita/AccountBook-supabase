import { Dialog, Transition } from "@headlessui/react";
import { Button, IconPlus, IconX } from "@supabase/ui";
import type { VFC } from "react";
import { Fragment, useCallback, useState } from "react";
import { client } from "src/libs/supabase";

type props = {
  uuid: string;
  getTitleList: VoidFunction;
};

export const AddTitle: VFC<props> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [author, setAuthor] = useState<string>("");

  // ダイアログを開く
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  // ダイアログを閉じる
  const closeModal = useCallback(() => {
    setCategory("");
    setAuthor("");
    setIsOpen(false);
  }, []);

  // カテゴリーの追加
  const handleAdd = useCallback(
    async (uuid: string) => {
      if (category == "") {
        alert("カテゴリー名が空です");
        return;
      }
      const { data, error } = await client
        .from("users")
        .insert([{ user_id: uuid, category: category, user_name: author }]);

      if (error) {
        alert(error);
      } else {
        if (data) {
          props.getTitleList();
          closeModal();
        }
      }
    },
    [category, author, props, closeModal]
  );

  return (
    <>
      <div className="p-2 border cursor-pointer" onClick={openModal}>
        <div className="flex justify-center">
          <div className="w-36 h-48 bg-blue-300">追加</div>
        </div>
        <div className="mt-2 text-center">ADD NEW</div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-10"
          onClose={closeModal}
        >
          <div className="px-4 min-h-screen text-center border-2">
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
              <div className="inline-block overflow-hidden p-6 my-8 w-full max-w-md bg-gray-50 rounded-xl shadow-xl order-gray-300">
                text-left align-middle transition-all transform border b›
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-medium leading-6 text-center text-gray-900"
                >
                  Add category
                </Dialog.Title>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="col-span-1 text-xl text-center">category</div>
                  <input
                    className="col-span-3 p-2 w-full h-10 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    value={category}
                    onChange={(e) => {
                      return setCategory(e.target.value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="col-span-1 text-xl text-center">
                    user_name
                  </div>
                  <input
                    className="col-span-3 p-2 w-full h-10 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    value={author}
                    onChange={(e) => {
                      return setAuthor(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-center mt-4">
                  <div className="p-2 w-32">
                    <Button
                      block
                      type="default"
                      size="large"
                      icon={<IconX />}
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="p-2 w-32">
                    <Button
                      block
                      size="large"
                      icon={<IconPlus />}
                      onClick={() => {return handleAdd(props.uuid)}}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
