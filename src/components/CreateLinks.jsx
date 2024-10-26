import React, { useState } from "react";
import { FormLinks } from "./FormLinks.jsx";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";

export const CreateLinks = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("blur");

  return (
    <>
      <Button auto color="primary" onClick={onOpen} size="md">
        Agregar Link
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Crear Link</ModalHeader>
              <ModalBody>
                <FormLinks btnLink={"Crear"} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};