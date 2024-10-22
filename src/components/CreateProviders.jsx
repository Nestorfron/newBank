import React, { useState } from "react";
import { FormProviders } from "./FormProviders.jsx";
import {
  Button,
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";

export const CreateProviders = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("blur");

  return (
    <>
      <Button auto color="primary" onClick={onOpen} size="md">
        Agregar Proveedor
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Crear Proveedor</ModalHeader>
          <ModalBody>
            <FormProviders btnProvider={"Crear"} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
