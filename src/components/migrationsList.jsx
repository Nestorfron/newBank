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
} from "@nextui-org/react";
import { EyeIcon } from "../assets/icons/EyeIcon.jsx";

export default function App({ asset }) {
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
                Migraciones
              </ModalHeader>
              <ModalBody>
                {asset.migrations.map((migration, index) => (
                  <li
                    key={migration.id}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {index + 1} - {formatDate(migration.migration_date)} -{" "}
                      <Chip color={mapColor(migration.migration_status)}>
                        {migration.migration_status === "Ordered"
                          ? "Ordenada"
                          : ""}
                        {migration.migration_status === "In_progress"
                          ? "En proceso"
                          : ""}
                        {migration.migration_status === "Completed"
                          ? "Completada"
                          : ""}
                      </Chip>
                    </span>
                  </li>
                ))}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
