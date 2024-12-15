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
import { Edit2 } from "lucide-react";
export const EditMigrations = ({ migration }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  if (!migration) {
    return <p>No se encontró la Migracion</p>;
  }

  const openModal = () => onOpen();

  return (
    <>
      <Button className="w-full" content="Edit migracion" auto onClick={openModal}>
      <Edit2 className="h-5 w-5" /> 
        <span className="text-lg text-default-700 cursor-pointer active:opacity-50">
         Editar
        </span>
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="2xl">
        <ModalContent>
        
            <FormMigrations
              btnMigration={"Actualizar"}
              migration={migration}
              id={migration.id}
            />
        </ModalContent>
      </Modal>
    </>
  );
};
