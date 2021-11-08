import { useCallback, useState } from "react";

export const useToggleModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //モーダルを開く
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  //モーダルを閉める
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {isOpen, openModal, closeModal};
};
