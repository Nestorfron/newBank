import React from "react";
import { FormMigrations } from "./FormMigrations.jsx";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { EditIcon } from "../assets/icons/EditIcon.jsx";
export const EditMigrations = ({ migration }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  if (!migration) {
    return <p>No se encontró la Migracion</p>;
  }

  const openModal = () => onOpen();

  return (
    <>
      <Button variant="link" content="Edit migracion" auto onClick={openModal}>
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <EditIcon />
        </span>
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Editar Migracion
          </ModalHeader>
          <ModalBody>
            <FormMigrations
              btnMigration={"Actualizar"}
              migration={migration}
              id={migration.id}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
