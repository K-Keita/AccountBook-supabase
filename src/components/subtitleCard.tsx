import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { Button, IconSave, IconTrash2, IconX } from "@supabase/ui";
import { Fragment, useCallback, useState } from "react";
import type { Data } from "src/components/titleList";
import { client } from "src/libs/supabase";
// import { item } from "src/pages/title";

type Props = {
  item: any;
  userData: Data;
  uuid: string;
  created_at: string;
  getItemList: VoidFunction;
};

export const SubtitleCard = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [volume, setVolume] = useState<string>(props.item.price.toString());
  const [isbn, setIsbn] = useState<string>(props.item.description.toString());
  const [possession, setPossession] = useState<boolean>(props.item.possession);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  let color = "grayscale";
  if (props.item.possession) {
    color = "grayscale-0";
  }

  const handleSetThumbnail = useCallback(async () => {
    const title = props.userData;
    title.image_url = props.item.image_url;
    const { error } = await client.from("manga_title").upsert(title);
    if (error) {
      alert(error);
    }
    closeModal();
  }, [props, closeModal]);

  const handleRemove = useCallback(async () => {
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

  const handleSave = useCallback(async () => {
    if (volume == "" || Number(volume) == NaN) {
      alert("Input volume as an integer.");
      return;
    }

    if (isbn == "") {
      alert("Input ISBN number.");
      return;
    }

    const { error } = await client.from("purchasedItem").upsert({
      id: props.item.id,
      user_id: props.item.user_id,
      category_id: props.item.category_id,
      price: Number(volume),
      description: isbn,
    });
    if (error) {
      alert(error);
    }
    props.getItemList();
    closeModal();
  }, [props, volume, isbn, possession, closeModal]);

  const d = new Date(props.created_at);
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const h = d.getHours();
  const minutes = d.getMinutes();
  const createdAt = `${month}/${date}/${h}:${minutes}`;

  return (
    <>
      <div className="p-2 border cursor-pointer" onClick={openModal}>
        <div className={color}>
          <div className="flex justify-center">
            <div className="w-32 h-60 bg-blue-400">
              <p>{props.item.price}</p>
              <p>{createdAt}</p>
            </div>
          </div>
        </div>
        <div className="mt-2 text-center">({props.item.description})</div>
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
                    value={volume}
                    onChange={(e) => {
                      return setVolume(e.target.value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="col-span-1 pt-1 text-xl text-center">
                    説明
                  </div>
                  <input
                    className="col-span-3 p-2 w-full h-10 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    value={isbn}
                    onChange={(e) => {
                      return setIsbn(e.target.value);
                    }}
                  />
                </div>
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
                <div className="pt-4 mx-4">
                  <Button block size="medium" onClick={handleSetThumbnail}>
                    SET TO THUMBNAIL
                  </Button>
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
                      onClick={handleSave}
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
