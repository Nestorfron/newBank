import React from "react";
import { FormEngineers } from "./FormEngineers.jsx";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { EditIcon } from "../assets/icons/EditIcon.jsx";

export const EditEngineers = ({ engineer }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  if (!engineer) {
    return <p>No se encontró el Engineer</p>;
  }

  const openModal = () => onOpen();

  return (
    <>
      <Button variant="link" content="Editar Engineer" auto onClick={openModal}>
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <EditIcon />
        </span>
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar Engineer
              </ModalHeader>
              <ModalBody>
                <FormEngineers
                  btnEngineer={"Actualizar"}
                  engineer={engineer}
                  id={engineer.id}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};  