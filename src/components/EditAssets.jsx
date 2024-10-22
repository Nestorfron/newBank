import React from "react";
import { FormAssets } from "./FormAssets.jsx";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { EditIcon } from "../assets/icons/EditIcon.jsx";
export const EditAssets = ({ asset }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  if (!asset) {
    return <p>No se encontró el activo</p>;
  }

  const openModal = () => onOpen();

  return (
    <>
      <Button variant="link" content="Edit asset" auto onClick={openModal}>
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <EditIcon />
        </span>
      </Button>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Editar Activo
          </ModalHeader>
          <ModalBody>
            <FormAssets btnAsset={"Actualizar"} asset={asset} id={asset.id} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
