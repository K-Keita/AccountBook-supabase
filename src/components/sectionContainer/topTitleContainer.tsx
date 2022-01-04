import { AddItem } from "src/components/addItem";
import { LinkButtonList } from "src/components/LinkButtonList";
import { PriceDisplay } from "src/components/utils/PriceDisplay";
import { Title } from "src/components/utils/title";
import { useToggleModal } from "src/hooks/useToggleModal";
import type { ItemData, UserData } from "src/interface/type";

type Props = {
  totalPrice: number;
  userData: UserData;
  itemList: ItemData[];
  getItemList: (id: string, year: number, month: number) => Promise<void>;
};

const d = new Date();
const date = d.getDate();

export const TopTitleContainer = (props: Props) => {
  const { isOpen, openModal, closeModal } = useToggleModal();
  const item = props.itemList.filter((value) => {
    return value.buyDate[2] === date.toString();
  });
  const totalItemsPrice = item.reduce((sum, element) => {
    return sum + element.price;
  }, 0);

  return (
    <div className="">
      <section className="fixed py-2 mx-auto w-full max-w-[800px] h-lg min-h-3lg">
        <h2 className="px-3 text-2xl">TITLE</h2>
        <div className="flex flex-col justify-end h-3lg">
          <div className="py-4 px-8">
            <Title />
          </div>
          <PriceDisplay
            totalPrice={props.totalPrice}
            targetAmount={props.userData.targetAmount}
            totalItemsPrice={totalItemsPrice}
          />
          <button
            onClick={openModal}
            className="flex justify-center py-1 px-1 my-3 mx-auto hover:bg-flower hover:bg-opacity-60 border border-flower shadow-2xl transition duration-300 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.0}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <p className="px-1 text-lg text-center">register</p>
            <AddItem
              isOpen={isOpen}
              closeModal={closeModal}
              userData={props.userData}
              getItemList={props.getItemList}
            />
          </button>
          <LinkButtonList />
        </div>
      </section>
      <div className="relative -z-10 h-lg min-h-3lg opacity-0" />
    </div>
  );
};
