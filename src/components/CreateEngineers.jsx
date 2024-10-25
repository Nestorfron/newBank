import React, { useState } from "react";
import { FormEngineers } from "./FormEngineers.jsx";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";

export const CreateEngineers = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("blur");

  return (
    <>
      <Button auto color="primary" onClick={onOpen} size="md">
        Agregar Ingeniero
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Agregar Ingeniero</ModalHeader>
              <ModalBody>
                <FormEngineers btnEngineer={"Crear"} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};