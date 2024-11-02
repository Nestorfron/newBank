import React, { useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
// import { CreateMessages } from "../components/CreateMessages.jsx";
// import { EditMessages } from "../components/EditMessages.jsx";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableColumn,
  Input,
  Pagination,
} from "@nextui-org/react";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";

export const Messages = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [provider, setProvider] = useState("");

  useTokenExpiration();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const filteredItems = useMemo(() => {
    let filteredMessages = [...store.messages];

    if (filterValue) {
      filteredMessages = filteredMessages.filter(
        (message) =>
          message.message
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          message.user_id.toLowerCase().includes(filterValue.toLowerCase()) ||
          message.provider_id
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          message.branch_id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Asegúrate de que 'status' esté en tus datos para filtrar adecuadamente
    if (statusFilter !== "all") {
      filteredMessages = filteredMessages.filter(
        (message) => message.status === statusFilter // Cambia según tus datos
      );
    }

    return filteredMessages;
  }, [store.messages, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const deleteMessage = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar el Mensaje?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteMessage(id).then(() => {
          Swal.fire("Mensaje eliminado correctamente", "", "success");
        });
      }
    });
  };

  const topContent = (
    <div className="flex justify-between gap-3 items-center">      
      <div className="flex justify-start gap-3 items-center">
        <span className="text-default-400 text-lg">
          Total de Mensajes : {store.messages.length}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          isClearable
          placeholder="Buscar por Mensaje..."
          value={filterValue}
          onClear={() => setFilterValue("")}          
          onValueChange={setFilterValue}
          className="w-full"
          startContent={<SearchIcon />}
        />
        <div>
          {/* <CreateMessages /> */}
        </div>
      </div>
    </div>
  );

  const bottomContent = (
    <div className="flex justify-center mt-4">
      <Pagination showControls page={page} total={pages} onChange={setPage} />
    </div>
  );

  const getProviderById = (providerId) => {
    const Provider = store.providers.find(
      (provider) => provider.id === providerId
    );
    setProvider(Provider);
  };
  

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getMe();
    actions.getMessages()
    actions.getProviders();
    actions.getBranchs();
    actions.getMigrations();
  }, []);

  return (
    <div className="m-5">
      <div className="flex justify-start gap-4 mt-4 mb-4">
        <span className="text-lg font-bold">Gestor de Mensajes</span>
      </div>
      <Table
        aria-label="Tabla de mensajes"
        isHeaderSticky
        isStriped
        topContent={topContent}
        bottomContent={bottomContent}
        classNames={{
          td: "text-center",
          th: "text-center",
        }}
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Mensaje</TableColumn>
          <TableColumn>Proveedor</TableColumn>
          <TableColumn>Sucursal</TableColumn>
          <TableColumn>Migracion</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((message) => (
            <TableRow key={message.id}>
              <TableCell>{message.id}</TableCell>
              <TableCell>{message.message}</TableCell>
              <TableCell>{message.provider_id ? store.providers.find(provider => provider.id === message.provider_id).company_name : "No asignado"}</TableCell>
              <TableCell>{message.branch_id ? store.branchs.find(branch => branch.id === message.branch_id).branch_cr : "No asignado"}</TableCell>
              <TableCell>{formatDate(message.migration_id ? store.migrations.find(migration => migration.id === message.migration_id).migration_date : "No asignado")}</TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Button variant="link" color="danger">
                    <span
                      className="text-lg text-danger cursor-pointer"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <DeleteIcon />
                    </span>
                  </Button>
                  {/* <EditMessages message={message} /> */}
                </div>
              </TableCell>              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};