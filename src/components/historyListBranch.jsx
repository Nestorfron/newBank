import React from "react";
import {
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { EyeIcon } from "../assets/icons/EyeIcon.jsx";

export default function HistoryListBranch({ branch }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const mapColor = (status) => {
    if (status === "Ordered") {
      return "success";
    } else if (status === "In_progress") {
      return "warning";
    } else if (status === "Completed") {
      return "danger";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="link" color="primary" onPress={onOpen}>
        <EyeIcon />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={scrollBehavior}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
               Historial
              </ModalHeader>
              <ModalBody>
                <Listbox textValue="id" aria-labelledby="listbox-label">  
                  {branch.history.map((history, index) => (
                    <ListboxItem
                      key={history.id}
                      className="flex justify-between border rounded-lg p-2 m-2"
                      textValue={history.id}
                    >
                      <p>
                        {index + 1} - {formatDate(history.date)} - {history.message}
                      </p>
                    </ListboxItem>
                  ))}
                </Listbox>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
