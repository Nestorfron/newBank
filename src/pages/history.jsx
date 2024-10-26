import React, { useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
//import { CreateHistory } from "../components/CreateHistory.jsx";
// import { EditHistory } from "../components/EditHistory.jsx";
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

export const History = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useTokenExpiration();

  const filteredItems = useMemo(() => {
    let filteredHistory = [...store.history];

    if (filterValue) {
      filteredHistory = filteredHistory.filter((history) =>
        history.message
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        history.user_id.toLowerCase().includes(filterValue.toLowerCase()) ||
        history.provider_id
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        history.branch_id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Asegúrate de que 'status' esté en tus datos para filtrar adecuadamente
    if (statusFilter !== "all") {
      filteredHistory = filteredHistory.filter(
        (history) => history.status === statusFilter // Cambia según tus datos
      );
    }

    return filteredHistory;
  }, [store.history, filterValue, statusFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const deleteHistory = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar el Mensaje?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteHistory(id).then(() => {
          Swal.fire("Mensaje eliminado correctamente", "", "success");
        });
      }
    });
  };

  const topContent = (
    <div className="flex justify-between gap-3 items-center">
      <div className="flex justify-start gap-3 items-center">
        <span className="text-default-400 text-lg">
          Total de Mensajes : {store.history.length}
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
          {/* <CreateHistory /> */}
        </div>
      </div>
    </div>
  );

  const bottomContent = (
    <div className="flex justify-center mt-4">
      <Pagination showControls page={page} total={pages} onChange={setPage} />
    </div>
  );

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getMe();
    actions.getHistory();
  }, []);

  return (
    <div className="m-5">      
      <div className="flex justify-start gap-4 mt-4 mb-4">
        <span className="text-lg font-bold">Gestor de Historial</span>
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
          <TableColumn>Fecha</TableColumn>
          <TableColumn>Mensaje</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((history) => (
            <TableRow key={history.id}>
              <TableCell>{history.id}</TableCell>
              <TableCell>{formatDate(history.date)}</TableCell>
              <TableCell>{history.message}</TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Button variant="link" color="danger">
                    <span
                      className="text-lg text-danger cursor-pointer"
                      onClick={() => deleteHistory(history.id)}
                    >
                      <DeleteIcon />
                    </span>
                  </Button>
                  {/* <EditHistory history={history} /> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default History;
    