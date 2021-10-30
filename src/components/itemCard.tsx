import { Dialog, Transition } from "@headlessui/react";
import { Button, IconSave, IconX, Input,Select } from "@supabase/ui";
import { Fragment, useCallback, useState } from "react";
import { client } from "src/libs/supabase";

type Props = {
  item: any;
  userData: any;
  uuid: string;
  getItemList: (year: number, month: number) => void;
};

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;

const colors = ["red", "blue", "green", "orange", "gray", "pink", "yellow"];

export const ItemCard = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [price, setPrice] = useState<string>(props.item.price.toString());
  const [description, setDescription] = useState<string>(
    props.item.description.toString()
  );
  const [value, setValue] = useState(props.item.categoryID);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

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
    props.getItemList(year, month);
    closeModal();
  }, [props, closeModal]);

  const handleSave = useCallback(
    async (value) => {
      if (price == "") {
        alert("Input price as an integer.");
        return;
      }

      if (description == "") {
        alert("Input ISBN number.");
        return;
      }

      const { error } = await client.from("purchasedItem").upsert({
        id: props.item.id,
        userID: props.item.userID,
        buyDate: props.item.buyDate,
        categoryID: value,
        price: Number(price),
        description: description,
      });

      if (error) {
        alert(error);
      }
      props.getItemList(year, month);
      closeModal();
    },
    [props, price, description, closeModal]
  );

  const date = `${props.item.buyDate[1]}/${props.item.buyDate[2]}`;

  const color =
    colors[props.userData.categoryList.indexOf(props.item.categoryID)];

  return (
    <>
      <div className="p-2 m-1 text-lg text-white bg-item bg-opacity-60 rounded-xl cursor-pointer">
        <div className="flex border-b">
          <p className="px-2 w-20 text-lg font-bold text-left">
            ¥{props.item.price.toLocaleString()}
          </p>
          <p className="ml-auto w-16">{date}</p>
          <p
            className="px-1 my-1 mr-2 w-20 text-sm text-center"
            style={{ border: `solid 1px ${color}` }}
          >
            {props.item.categoryID}
          </p>
          <button className="px-2 my-1 border-r border-l" onClick={openModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button className="px-2 my-1" onClick={handleRemove}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
        <div className="flex">
          <p className="py-1 ml-3 text-sm">{props.item.description}</p>
        </div>
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
                  編集
                </Dialog.Title>
                <div className="flex justify-between mt-4">
                  <div className="pt-1 w-20 text-lg">価格:</div>
                  <Input
                    className="w-80"
                    value={price}
                    onChange={(e) => {
                      return setPrice(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <div className="pt-1 w-20 text-lg">説明:</div>
                  <Input
                    className="w-80"
                    value={description}
                    onChange={(e) => {
                      return setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <p className="pt-1 mr-2 text-lg text-center">カテゴリー:</p>
                  <Select
                    className="w-60"
                    defaultValue={props.item.categoryID}
                    onChange={handleChange}
                  >
                    {props.userData.categoryList.map(
                      (value: string, index: number) => {
                        return (
                          <option value={value} key={index}>
                            {value}
                          </option>
                        );
                      }
                    )}
                  </Select>
                </div>
                <div className="flex justify-center mt-4">
                  <div className="p-2 w-32">
                    <Button
                      block
                      type="outline"
                      size="tiny"
                      icon={<IconX />}
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="p-2 w-32">
                    <Button
                      block
                      size="tiny"
                      type="outline"
                      // style={{background: "skyBlue"}}
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
