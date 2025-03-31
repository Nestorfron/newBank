import React from "react";
import { FormUsers_MB } from "./FormUsersMB.jsx";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { EditIcon } from "../assets/icons/EditIcon.jsx";

export const EditUsersMB = ({ userMB }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  if (!userMB) {
    return <p>No se encontró el usuario MB</p>;
  }

  const openModal = () => onOpen();

  return (
    <>
      <Button variant="ghost" content="Edit usuario MB" auto onClick={openModal}>
        <span className="text-lg text-default-700 cursor-pointer active:opacity-50">
          <EditIcon />
        </span>
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Editar Usuario MB
          </ModalHeader>
          <ModalBody>
            <FormUsers_MB
              btnUserMB={"Actualizar"}
              userMB={userMB}
              id={userMB.id}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
