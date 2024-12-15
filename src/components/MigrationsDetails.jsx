import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import {
  FileText,
  ArrowRight,
  CheckCircle,
  Circle,
  XCircle,
} from "lucide-react";
import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Tabs,
  Tab,
  Input,
  Textarea,
} from "@nextui-org/react";
import { EditMigrations } from "./EditMigrations.jsx";
import Swal from "sweetalert2";

export const MigrationsDetails = ({ migration, id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");
  const { store, actions } = useContext(Context);
  const [showReturnProcess, setShowReturnProcess] = useState(false);
  const [returnSteps, setReturnSteps] = useState([
    {
      id: "1",
      description: "Desconexión y empaquetado",
      assignee: "Técnico de TI",
      status: "pending",
    },
    {
      id: "2",
      description: "Transporte al área de logística",
      assignee: "Equipo de Logística",
      status: "pending",
    },
    {
      id: "3",
      description: "Verificación y registro",
      assignee: "Encargado de Inventario",
      status: "pending",
    },
    {
      id: "4",
      description: "Almacenamiento",
      assignee: "Encargado de Almacén",
      status: "pending",
    },
  ]);

  const me = store.me;

  const [migrationStatus, setMigrationStatus] = useState();
  const [status, setStatus] = useState(migration.migration_status);
  const [message, setMessage] = useState({
    message: null,
    provider_id: migration.provider_id,
    branch_id: migration.branch_id,
    migration_id: migration.id,
    user_id: me.role === "Master" ? me.id : null,
    admins_id: me.role === "Admin" ? me.id : null,
    engineer_id: me.role === "Ingeniero de Campo" ? me.id : null,
  });
  const [newMigration, setNewMigration] = useState(migration);

  const statusColor = {
    Ordered: "primary",
    In_progress: "warning",
    Completed: "success",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleReturnToWarehouse = () => {
    setShowReturnProcess(true);
  };

  const handleUpdateReturnStep = (stepId, newStatus) => {
    setReturnSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId ? { ...step, status: newStatus } : step
      )
    );
  };

  const handleStatusChange = (newStatus) => {
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "ID de migración inválido",
        text: "No se encontró el ID de la migración.",
      });
      return;
    }

    setMigrationStatus(newStatus);
    setStatus(newStatus);

    actions.editMigrationStatus(id, newStatus);
  };

  if (!migration) {
    return <p>No se encontró la Migracion</p>;
  }

  const handleSendMenssage = () => {
    actions.add_message(
      message.message,
      message.provider_id,
      message.branch_id,
      message.migration_id,
      message.user_id,
      message.admins_id,
      message.engineer_id
    );
    setMessage({
      message: null,
    });

    actions.getMigrations();
    actions.getMessages();
    setNewMigration(store.migrations.find((migration) => migration.id === id));
    
  };

  const openModal = () => onOpen();

  return (
    <>
      <Button
        className="w-3/4 border-gary-800 border-1 border-solid dark:border-gray-500 bg-transparent hover:scale-95"
        content="Edit migracion"
        auto
        onClick={openModal}
      >
        <FileText className="mr-2 h-4 w-4" />
        <span className="text-lg  cursor-pointer active:opacity-50">
          Gestionar Migración
        </span>
      </Button>

      <Modal
        backdrop={backdrop}
        isOpen={isOpen}
        onClose={onClose}
        className="w-full max-w-5xl"
      >
        <ModalContent>
          <ModalBody className="w-full">
            <Card className="w-full max-w-4xl border-none shadow-none">
              <CardHeader className="w-full">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Informe de Migración # {id}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {migration.migration_description}
                    </p>
                  </div>
                  <div className="flex items-center ml-2">
                    <Chip
                      status={
                        migrationStatus
                          ? migrationStatus
                          : migration.migration_status
                      }
                      variant="shadow"
                      color={
                        statusColor[
                          migrationStatus
                            ? migrationStatus
                            : migration.migration_status
                        ]
                      }
                    >
                      {status === "Ordered"
                        ? "Ordenada"
                        : status === "In_progress"
                        ? "En Progreso"
                        : "Completada"}
                    </Chip>
                    <div className="flex justify-end ml-2 w-full gap-2">
                      <Button
                        variant="ghost"
                        color={statusColor["Ordered"]}
                        size="sm"
                        onClick={() => handleStatusChange("Ordered")}
                      >
                        <Circle className="mr-1 h-4 w-4" /> Ordenada
                      </Button>
                      <Button
                        variant="ghost"
                        color={statusColor["In_progress"]}
                        size="sm"
                        onClick={() => handleStatusChange("In_progress")}
                      >
                        <ArrowRight className="mr-1 h-4 w-4" /> En Progreso
                      </Button>
                      <Button
                        variant="ghost"
                        color={statusColor["Completed"]}
                        size="sm"
                        onClick={() => handleStatusChange("Completed")}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" /> Completada
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="w-full">
                <Tabs
                  aria-label="Detalles de Migración"
                  className="flex flex-col"
                >
                  <Tab key="details" title="Detalles">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold">Descripción</h3>
                      <p>{migration.migration_description}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold">
                        Fecha de Instalación
                      </h3>
                      <p>{formatDate(migration.installation_date)}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold">
                        Fecha de Migración
                      </h3>
                      <p>{formatDate(migration.migration_date)}</p>
                    </div>
                  </Tab>
                  <Tab key="log" title="Bitácora">
                    <div className="flex flex-col gap-4">
                      <form className="my-2">
                        <div className="flex flex-col gap-2">
                          {newMigration.messages.map((message, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center mb-2"
                            >
                              <p>
                                {" "}
                                {index + 1} - {message.message}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mb-4">
                          <Input
                            className="w-1/3"
                            value={me.user_name}
                            name="user_name"
                          />
                          <Textarea
                            type="text"
                            placeholder="Añadir entrada a la bitácora..."
                            className="flex-grow"
                            value={message.message}
                            name="message"
                            onChange={(e) =>
                              setMessage({
                                ...message,
                                message: e.target.value,
                              })
                            }
                          />
                          <Button onClick={handleSendMenssage}>Añadir</Button>
                        </div>
                      </form>
                    </div>
                  </Tab>

                  <Tab key="return" title="Retorno">
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Proceso de Retorno a Almacén
                      </h3>
                      {!showReturnProcess ? (
                        <Button onClick={handleReturnToWarehouse}>
                          Iniciar Retorno a Almacén
                        </Button>
                      ) : (
                        returnSteps.map((step) => (
                          <div
                            key={step.id}
                            className="mb-4 p-4 border rounded-md"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">
                                {step.description}
                              </h4>
                              <Chip>{step.status}</Chip>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Asignado a: {step.assignee}
                            </p>
                            <div className="flex space-x-2">
                              <Button
                                variant={
                                  step.status === "pending"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  handleUpdateReturnStep(step.id, "pending")
                                }
                              >
                                Pendiente
                              </Button>
                              <Button
                                variant={
                                  step.status === "in-progress"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  handleUpdateReturnStep(step.id, "in-progress")
                                }
                              >
                                En Progreso
                              </Button>
                              <Button
                                variant={
                                  step.status === "completed"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  handleUpdateReturnStep(step.id, "completed")
                                }
                              >
                                Completado
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </CardBody>

              <CardFooter className="w-full mt-2 border-t-2 flex justify-between">
                <Button auto onClick={onClose}>
                  Cerrar
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <EditMigrations migration={migration} className="w-full" />
                  </Button>
                  <Button variant="destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelar Migración
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
