import React from "react";
import { FormLinks } from "./FormLinks.jsx";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { EditIcon } from "../assets/icons/EditIcon.jsx";

export const EditLinks = ({ link }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  if (!link) {
    return <p>No se encontró el link</p>;
  }

  const openModal = () => onOpen();

  return (
    <>
      <Button variant="link" content="Edit link" auto onClick={openModal}>
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <EditIcon />
        </span>
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar Link
              </ModalHeader>
              <ModalBody>
                <FormLinks
                  btnLink={"Actualizar"}
                  link={link}
                  id={link.id}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};