import type { UserData } from "src/interface/type";
import { colors } from "src/utils";

import { AddCategory } from "../addCategory";
import { EditCategory } from "../editCategory";

type Props = {
  userData: UserData;
  getItemList: (id: string, year: number, month: number) => Promise<void>;
  // editCategory: JSX.Element;
  addCategory: JSX.Element;
}

export const CategoryContainer = (props: Props) => {
  return (
    <section>
      <h2 className="py-3 px-4 text-4xl font-bold sm:pt-8">Category</h2>
      <div className="m-3 shadow-2xl ">
        {props.userData.categoryList.map((category, index) => {
          return (
            <div
              className={`flex justify-between p-2 my-1 bg-blue-300 bg-opacity-30 rounded-sm border-b last:border-b-0 ${
                index % 2 === 1
                  ? "animate-tilt-in-right-1"
                  : "animate-tilt-in-left-1"
              } `}
              key={category}
            >
              <p>
                <span
                  style={{ borderColor: colors[index] }}
                  className="inline-block mr-2 w-3 h-3 rounded-full border-2"
                ></span>
                {category}
              </p>
              <EditCategory
                category={category}
                getItemList={props.getItemList}
                userData={props.userData}
              />
            </div>
          );
        })}
      </div>
      <AddCategory userData={props.userData} getItemList={props.getItemList} />
    </section>
  );
};
