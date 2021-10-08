import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AddTitle } from "src/components/addTitle";

export type Data = {
  id: number;
  user_id: string;
  category: string;
  title: string;
  user_name: string;
  image_url: string;
};

type TitlesProps = {
  userData: Data[];
  uuid: string;
  getTitleList: VoidFunction;
  filterText: string;
};

export const TitleList = (props: TitlesProps) => {

  return (
    <div className="grid grid-cols-3 gap-2 m-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
      <AddTitle uuid={props.uuid} getTitleList={props.getTitleList} />
      {props.userData.map((data) => {
        return (
          <Link key={data.id} href={`/title?id=${data.id}`} passHref>
            <div className="p-2 border cursor-pointer">
              <div className="flex justify-center">
                <div className="bg-green-100">{data.category}</div>
              </div>
              <div className="mt-2 text-center">{data.user_name}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
