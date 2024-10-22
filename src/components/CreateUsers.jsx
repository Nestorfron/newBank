import React, { useState } from "react";
import { FormUsers } from "./FormUsers.jsx";
import {
  Button,
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";

export const CreateUsers = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("blur");

  return (
    <>
      <Button auto color="primary" onClick={onOpen} size="md">
        Agregar Usuario
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Crear Usuario Nuevo</ModalHeader>
          <ModalBody>
            <FormUsers btnUser={"Crear"} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
