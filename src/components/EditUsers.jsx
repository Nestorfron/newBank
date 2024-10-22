import React from "react";
import { FormUsers } from "./FormUsers.jsx";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { EditIcon } from "../assets/icons/EditIcon.jsx";

export const EditUsers = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  if (!user) {
    return <p>No se encontró el usuario</p>;
  }
  const openModal = () => onOpen();

  return (
    <>
      <Button variant="link" content="Edit asset" auto onClick={openModal}>
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <EditIcon />
        </span>
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Editar Usuario
          </ModalHeader>
          <ModalBody>
            <FormUsers btnUser={"Actualizar"} user={user} id={user.id} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
