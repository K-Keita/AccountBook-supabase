import { Dialog, Transition } from "@headlessui/react";
import { Button, IconPlus, IconX, Select } from "@supabase/ui";
import { Fragment, useCallback, useState } from "react";
import { client } from "src/libs/supabase";

type Props = {
  userData: any;
  uuid: string;
  getItemList: VoidFunction;
};

export const AddSubtitle = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [value, setValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  //モーダルを開く
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  //モーダルを閉める
  const closeModal = useCallback(() => {
    setPrice("");
    setDescription("");
    setIsOpen(false);
  }, []);

  //商品の追加
  const handleAdd = useCallback(
    async (value) => {
      if (price === "") {
        alert("Priceが空です");
        return;
      }

      if (value === "") {
        alert("カテゴリーを選択してください");
        return;
      }

      const { data, error } = await client.from("purchasedItem").insert([
        {
          user_id: props.uuid,
          category_id: value,
          price: price,
          description: description,
        },
      ]);
      if (error) {
        alert(error);
      } else {
        if (data) {
          props.getItemList();
          closeModal();
        }
      }
    },
    [props, price, description, closeModal]
  );

  return (
    <>
      <div className="p-2 border" onClick={openModal}>
        <div className="flex justify-center">
          <div className="w-32 h-12 text-center bg-yellow-300  cursor-pointer">
            登録
          </div>
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
              <div className="inline-block overflow-hidden p-6 my-8 w-full max-w-md text-left align-middle bg-gray-50 rounded-xl border border-gray-300 shadow-xl transition-all transform">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-medium leading-6 text-center text-gray-900"
                >
                  Add Subtitle
                </Dialog.Title>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="col-span-1 pt-1 text-xl text-center">
                    価格
                  </div>
                  <input
                    className="col-span-3 p-2 w-full h-10 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    value={price}
                    type="number"
                    autoFocus
                    min={1}
                    onChange={(e) => {
                      return setPrice(e.target.value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="col-span-1 pt-1 text-xl text-center">
                    説明
                  </div>
                  <input
                    className="col-span-3 p-2 w-full h-10 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    value={description}
                    onChange={(e) => {
                      return setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="col-span-1 pt-1 text-xl text-center">
                    日付
                  </div>
                  <input
                    className="col-span-3 p-2 w-full h-10 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    value={description}
                    onChange={(e) => {
                      return setDescription(e.target.value);
                    }}
                  />
                </div>
                <Select label="Select label" onChange={handleChange}>
                  {props.userData?.categories_list?.map((value) => {
                    return (
                      <Select.Option value={value} key={value}>
                        {value}
                      </Select.Option>
                    );
                  })}
                </Select>
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
                      onClick={() => {
                        return handleAdd(value);
                      }}
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
