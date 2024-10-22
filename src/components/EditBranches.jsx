import React from "react";
import { FormBranches } from "./FormBranches.jsx";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { EditIcon } from "../assets/icons/EditIcon.jsx";
export const EditBranches = ({ branch }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  if (!branch) {
    return <p>No se encontró la sucursal</p>;
  }

  const openModal = () => onOpen();

  return (
    <>
      <Button variant="link" content="Edit sucursal" auto onClick={openModal}>
        <EditIcon className="text-lg text-default-400 cursor-pointer active:opacity-50" />
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Editar Sucursal
          </ModalHeader>
          <ModalBody>
            <FormBranches
              btnBranch={"Actualizar"}
              branch={branch}
              id={branch.id}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
