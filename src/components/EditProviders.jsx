import React from "react";
import { FormProviders } from "./FormProviders.jsx";
import {
  Button,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";
import { EditIcon } from "../assets/icons/EditIcon.jsx";

export const EditProviders = ({ provider }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  if (!provider) {
    return <p>No se encontró el proveedor</p>;
  }

  const openModal = () => onOpen();

  return (
    <>
      <Button variant="ghost" content="Edit asset" auto onClick={openModal}>
        <span className="text-lg text-default-700 cursor-pointer active:opacity-50">
          <EditIcon />
        </span>
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Editar Activo
          </ModalHeader>
          <ModalBody>
            <FormProviders
              btnProvider={"Actualizar"}
              provider={provider}
              id={provider.id}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
