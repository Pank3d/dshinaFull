import { Modal } from "@mantine/core";
import React from "react";

export const ModalComponent = ({
  opened,
  close,
  title,
  children,
}: {
  opened: boolean;
  close: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Modal opened={opened} onClose={close} title={title}>
      {children}
    </Modal>
  );
};
