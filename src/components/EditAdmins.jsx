import React from "react";
import { FormAdmins } from "./FormAdmins.jsx";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { EditIcon } from "../assets/icons/EditIcon.jsx";

export const EditAdmins = ({ admin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  if (!admin) {
    return <p>No se encontró el Admins</p>;
  }

  const openModal = () => onOpen();

  return (
    <>
      <Button variant="link" content="Editar Admins" auto onClick={openModal}>
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
           <EditIcon />
          </span>
        </span>
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar Admins
              </ModalHeader>
              <ModalBody>
                <FormAdmins
                  btnAdmins={"Actualizar"}
                  admin={admin}
                  id={admin.id}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};