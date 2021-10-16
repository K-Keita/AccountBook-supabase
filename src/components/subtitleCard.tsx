import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { Button, IconSave, IconTrash2, IconX, Select } from "@supabase/ui";
import { Fragment, useCallback, useState } from "react";
import type { Data } from "src/components/titleList";
import { client } from "src/libs/supabase";
import { UserData } from "src/pages/title";

type Props = {
  item: any;
  userData: any;
  uuid: string;
  created_at: string;
  getItemList: VoidFunction;
};

const colors = ["red", "blue", "green", "orange", "gray", "pink", "yellow"]

export const SubtitleCard = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [price, setPrice] = useState<string>(props.item.price.toString());
  const [description, setDescription] = useState<string>(
    props.item.description.toString()
  );
  const [possession, setPossession] = useState<boolean>(props.item.possession);
  const [category_id, setCategory_id] = useState<string>(
    props.item.category_id
  );
  const [value, setValue] = useState(props.item.category_id);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // let color = "grayscale";
  // if (props.item.possession) {
  //   color = "grayscale-0";
  // }

  const handleRemove = useCallback(async () => {
    if (!confirm("削除しますか？")) {
      return false;
    }
    const { error } = await client
      .from("purchasedItem")
      .delete()
      .eq("id", props.item.id);
    if (error) {
      alert(error);
    }
    props.getItemList();
    closeModal();
  }, [props, closeModal]);

  const handleSave = useCallback(
    async (value) => {
      if (price == "" || Number(price) == NaN) {
        alert("Input price as an integer.");
        return;
      }

      if (description == "") {
        alert("Input ISBN number.");
        return;
      }

      const { error } = await client.from("purchasedItem").upsert({
        id: props.item.id,
        user_id: props.item.user_id,
        category_id: Number(value),
        price: Number(price),
        description: description,
      });

      if (error) {
        alert(error);
      }
      props.getItemList();
      closeModal();
    },
    [props, price, description, possession, closeModal]
  );

  const d = new Date(props.created_at);
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const h = d.getHours();
  const minutes = d.getMinutes();
  const createdAt = `${month}/${date}.${h}:${minutes}`;

  const color = colors[props.userData.categories_list.indexOf(props.item.category_id)];

  console.log(color);

  return (
    <>
      <div className="p-2 border cursor-pointer">
        <div className="flex" style={{border: `solid 3px ${color}`}}>
          <p className="bg-green-200">{createdAt}</p>
          <p>{props.item.price}</p>
          <p>カテゴリー：{props.item.category_id}</p>
          <div className="text-center">({props.item.description})</div>
          <button className="bg-green-200" onClick={openModal}>
            編集
          </button>
          <button onClick={handleRemove}>
            <IconTrash2 />
          </button>
        </div>
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
                <Select
                  label="Select label"
                  defaultValue={props.item.category_id}
                  onChange={handleChange}
                >
                  {props.userData.categories_list.map((value: any) => {
                    return (
                      <Select.Option value={value} key={value}>
                        {value}
                      </Select.Option>
                    );
                  })}
                </Select>
                <div className="grid grid-cols-5 gap-2 mt-4">
                  <div className="col-span-2 pt-1 text-xl text-center">
                    Possession
                  </div>
                  <div className="col-span-3 pt-2 pl-2">
                    <input
                      type="checkbox"
                      className="scale-150"
                      checked={possession}
                      onChange={() => {
                        return setPossession(!possession);
                      }}
                    />
                  </div>
                </div>
                <div className="mx-4 mt-4 bg-blue-50">
                  <Disclosure>
                    {({ open }) => {
                      return (
                        <>
                          <Disclosure.Button className="flex justify-between py-2 px-4 w-full text-sm font-medium text-left text-blue-500 bg-blue-100 hover:bg-blue-200 rounded-lg focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 focus:outline-none">
                            <span>REMOVE THIS</span>
                            <ChevronUpIcon
                              className={`${
                                open ? "transform rotate-180" : ""
                              } w-5 h-5 text-blue-500`}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="p-4 text-gray-500 text-md">
                            <Button
                              block
                              onClick={handleRemove}
                              icon={<IconTrash2 />}
                            >
                              REMOVE
                            </Button>
                          </Disclosure.Panel>
                        </>
                      );
                    }}
                  </Disclosure>
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
                      icon={<IconSave />}
                      onClick={() => {
                        return handleSave(value);
                      }}
                    >
                      Save
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
