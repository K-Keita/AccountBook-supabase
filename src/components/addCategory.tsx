import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useToggleModal } from "src/hooks/useToggleModal";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

import { PrimaryButton } from "./utils/primaryButton";

type Props = {
  userData: UserData;
  getItemList: (id: string, year: number, month: number) => void;
};

type FormValue = {
  categoryName: string;
};

const d = new Date();

const year = d.getFullYear();
const month = d.getMonth() + 1;

export const AddCategory = (props: Props) => {
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isOpen, openModal, closeModal } = useToggleModal();

  const { register, handleSubmit } = useForm<FormValue>();

  const onSubmit: SubmitHandler<FormValue> = (data) => {
    addCategory(data.categoryName);
  };

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

    closeModal();
    props.getItemList(props.userData.id.toString(), year, month);
  };

  // const handleOpenCategory = () => {
  //   setIsOpen(true);
  // };

  // const handleCloseCategory = () => {
  //   setIsOpen(false);
  // };

  return (
    <>
      <div className="flex justify-end px-8">
        <PrimaryButton type="button" text="追加" onClick={openModal} />
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-50"
          onClose={closeModal}
        >
          <div className="px-4 text-center" style={{ fontFamily: "游明朝体" }}>
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
              <div className="inline-block overflow-hidden p-6 my-6 w-full align-middle bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800 rounded-xl transition-all transform">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-center text-gray-900"
                >
                  CategoryName
                </Dialog.Title>
                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                  <input
                    autoFocus
                    {...register("categoryName")}
                    className="block py-2 px-1 my-5 mx-auto w-11/12 bg-white bg-opacity-50"
                  />
                  <div className="flex justify-around mt-3">
                    <PrimaryButton
                      text={"Change"}
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                    />
                    <PrimaryButton
                      text={"Cancel"}
                      type="reset"
                      onClick={closeModal}
                    />
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
