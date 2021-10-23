import { Dialog, Transition } from "@headlessui/react";
import { Auth, Button, IconX } from "@supabase/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { client } from "src/libs/supabase";

type Props = {
  category: string;
  getItemList: VoidFunction;
  userData: any;
  num: number;
};

export const EditCategory = (props: Props) => {
  const { user } = Auth.useUser();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<string>(props.category);

  const router = useRouter();
  const { id } = router.query;

  const editItems = async (category_id, value) => {
    const { error } = await client
      .from("purchasedItem")
      .update({
        user_id: props.userData.user_id,
        category_id: value,
      })
      .match({ category_id: category_id, user_id: props.userData.user_id });

    if (error) {
      alert(error);
    }
    props.getItemList();
  };

  useEffect(() => {
    props.getItemList();
  }, [user, props.getItemList, id, router]);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  console.log(props.num);

  const handleRemove = useCallback(
    async (category_id, user_id) => {
      const { error } = await client
        .from("purchasedItem")
        .delete()
        .eq("category_id", category_id)
        .eq("user_id", user_id);
      if (error) {
        alert(error);
      }
      props.getItemList();
      closeModal();
    },
    [props, closeModal]
  );

  //カテゴリーの削除
  const removeCategory = async (value: string) => {
    if (!confirm("削除しますが、よろしいですか？ *このカテゴリーに属している商品も削除されます。")) {
      return false;
    }
    if (props.userData) {
      const arr = props.userData.categories_list;

      const newArr = arr.filter((v: any) => {
        return v !== value;
      });

      const { error } = await client.from("users").upsert({
        id: props.userData.id,
        user_id: props.userData.user_id,
        categories_list: newArr,
      });

      if (error) {
        alert(error);
      }

      handleRemove(value, props.userData.user_id);

      props.getItemList();
    }
  };

  const editCategory = async (value: string, category: string) => {
    if (props.userData) {
      const arr = props.userData.categories_list;

      const num = arr.indexOf(category);

      arr.splice(num, 1, value);

      const { error } = await client.from("users").upsert({
        id: props.userData.id,
        user_id: props.userData.user_id,
        categories_list: arr,
      });

      if (error) {
        alert(error);
      }

      editItems(category, value);
      props.getItemList();
    }
  };

  return (
    <div>
      <Link href={`/category?id=${props.num}`} passHref>
        <p className="text-xl cursor-pointer">{props.category}</p>
      </Link>
      <button className="cursor-pointer" onClick={openModal}>
        編集
      </button>
      <button
        className="cursor-pointer"
        onClick={() => {
          return removeCategory(props.category);
        }}
      >
        削除
      </button>
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
                    defaultValue={props.category}
                    onChange={(e) => {
                      return setCategory(e.target.value);
                    }}
                  />
                </div>
                <button
                  className=""
                  onClick={() => {
                    return editCategory(category, props.category);
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
    </div>
  );
};
