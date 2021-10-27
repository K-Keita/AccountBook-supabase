import { Dialog, Transition } from "@headlessui/react";
import { Button, IconX } from "@supabase/ui";
import { Fragment, useCallback, useEffect,useState } from "react";
import { client } from "src/libs/supabase";

type Props = {
  category: string[];
  getItemList: (year: number, month: number) => void;
  userData: any;
  num: number;
};

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();

export const EditCategory = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<string>(
    props.category[props.num - 1],
  );

  useEffect(() => {
    setCategory(props.category[props.num - 1]);
  }, [props.category,props.num])

  const editItems = async (prevValue: string, value: string) => {
    console.log(prevValue, value);
    const { error } = await client
      .from("purchasedItem")
      .update({
        userID: props.userData.userID,
        categoryID: value,
      })
      .match({ categoryID: prevValue, userID: props.userData.userID });

    if (error) {
      alert(error);
    }
    props.getItemList(year, month);
  };

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleRemove = useCallback(
    async (categoryID, userID) => {
      console.log(categoryID, userID);
      // const { error } = await client
      //   .from("purchasedItem")
      //   .delete()
      //   .eq("categoryID", categoryID)
      //   .eq("userID", userID);
      // if (error) {
      //   alert(error);
      // }
      props.getItemList(year, month);
      closeModal();
    },
    [props, closeModal]
  );

  //カテゴリーの削除
  const removeCategory = async (value: string) => {
    console.log(value);
    if (
      !confirm(
        "削除しますが、よろしいですか？ *このカテゴリーに属している商品も削除されます。"
      )
    ) {
      return false;
    }
    if (props.userData) {
      const arr = props.userData.categoryList;

      const newArr = arr.filter((v: any) => {
        return v !== value;
      });

      // const { error } = await client.from("users").upsert({
      //   id: props.userData.id,
      //   userID: props.userData.userID,
      //   categoryList: newArr,
      // });

      // if (error) {
      //   alert(error);
      // }

      handleRemove(value, props.userData.userID);

      props.getItemList(year, month);
      closeModal();
    }
  };

  const editCategory = async (value: string, category: string) => {
    if (props.userData) {
      const arr = props.userData.categoryList;

      const num = arr.indexOf(category);

      arr.splice(num, 1, value);

      console.log(value, category);
      console.log({
        id: props.userData.id,
        userID: props.userData.userID,
        categoryList: arr,
      });

      const { error } = await client.from("users").upsert({
        id: props.userData.id,
        userID: props.userData.userID,
        categoryList: arr,
      });

      if (error) {
        alert(error);
      }

      editItems(category, value);
      props.getItemList(year, month);
    }
  };

  console.log(category);

  return (
    <>
      <div className="flex justify-around">
        <button
          className="table p-1 mx-4 bg-green-100 border border-gray-400 cursor-pointer"
          onClick={openModal}
        >
          編集
        </button>
        <button
          className="table p-1 mx-4 bg-green-100 border border-gray-400 cursor-pointer"
          onClick={() => {
            return removeCategory(props.category[props.num - 1]);
          }}
        >
          削除
        </button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-50"
          onClose={closeModal}
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
              <div className="inline-block overflow-hidden p-6 my-8 w-full max-w-md text-left align-middle bg-gray-50 rounded-xl border border-gray-300 shadow-xl transition-all transform">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-medium leading-6 text-center text-gray-900"
                >
                  Add Subtitle
                </Dialog.Title>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="col-span-1 pt-1 text-xl text-center">
                    カテゴリー
                  </div>
                  <input
                    className="col-span-3 p-2 w-full h-10 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    value={category}
                    onChange={(e) => {
                      return setCategory(e.target.value);
                    }}
                  />
                </div>
                <button
                  className=""
                  onClick={() => {
                    return editCategory(
                      category,
                      props.category[props.num - 1]
                    );
                  }}
                >
                  変更
                </button>
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
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
