import Image from "next/image";
import type { Dispatch, RefObject, SetStateAction} from "react";
import { useCallback } from "react";

type Props = {
  bookList: any;
  setDescription: Dispatch<SetStateAction<string>>;
  close: RefObject<HTMLButtonElement>;
};

export const BookList = (props: Props) => {
  const handleClick = useCallback(
    (isbn: string) => {
      props.setDescription(isbn);
      props.close.current?.click();
    },
    [props]
  );

  return (
    <div className="grid grid-cols-3 gap-2 m-4">
      {props.bookList.map((book: any, index: number) => {
        return (
          <div
            key={index}
            className="p-2 border cursor-pointer"
            onClick={() => {return handleClick(book.isbn)}}
          >
            <div className="flex justify-center">
              <Image
                src={book.imageUrl}
                alt="thumbnail"
                width={126}
                height={200}
              />
            </div>
            <div className="mt-2 text-sm text-center">{book.title}</div>
          </div>
        );
      })}
    </div>
  );
};
