import React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateEngineers } from "./CreateEngineers.jsx";
import { EditEngineers } from "./EditEngineers.jsx";
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
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";

export const Engineers = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  useTokenExpiration();

  const colorMap = {
    active: "success",
    inactive: "danger",
  };

  const filteredItems = useMemo(() => {
    let filteredEngineers = [...store.engineers];

    if (filterValue) {
      filteredEngineers = filteredEngineers.filter((engineer) =>
        engineer.user_name
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    // Asegúrate de que 'status' esté en tus datos para filtrar adecuadamente
    if (statusFilter !== "all") {
      filteredEngineers = filteredEngineers.filter(
        (engineer) => engineer.is_active ? statusFilter === "active" : statusFilter === "inactive"
      );
    }

    return filteredEngineers;
  }, [store.engineers, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const deleteEngineer = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar el Engineer?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteEngineer(id).then(() => {
          Swal.fire("Engineer eliminado correctamente", "", "success");
        });
      }
    });
  };

  const topContent = (
    <div className="flex justify-between gap-3 items-center">
      <div className="flex justify-start gap-3 items-center">
        <span className="text-default-400 text-lg">
          Total de Ingenieros : {store.engineers.length}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          isClearable
          placeholder="Buscar por Engineer..."
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
          className="w-full"
          startContent={<SearchIcon />}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button>Estado</Button>
          </DropdownTrigger>
          <DropdownMenu
            selectedKeys={statusFilter}
            selectionMode="multiple"
            onSelectionChange={(e) => setStatusFilter(e)}
          >
            <DropdownItem className="capitalize" key="all">
              Todos
            </DropdownItem>
            <DropdownItem className="capitalize" key="active">
              Activo
            </DropdownItem>
            <DropdownItem className="capitalize" key="inactive">
              Inactivo
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div>
          <CreateEngineers />
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
  }, []);

  

  return (
    <div className="m-5">
      <div className="flex justify-start gap-4 mt-4 mb-4">
        <span className="text-lg font-bold">Ingenieros</span>
      </div>
      <Table
        aria-label="Tabla de Engineersistradores"
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
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Nombres</TableColumn>
          <TableColumn>Apellidos</TableColumn>
          <TableColumn>N° de Empleado</TableColumn>
          <TableColumn>Zona</TableColumn>
          <TableColumn>Rol</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((engineer) => (
            <TableRow key={engineer.id}>
              <TableCell>{engineer.id}</TableCell>
              <TableCell>{engineer.user_name}</TableCell>
              <TableCell>{engineer.names}</TableCell>
              <TableCell>{engineer.last_names}</TableCell>
              <TableCell>{engineer.employee_number}</TableCell>
              <TableCell>{engineer.subzone}</TableCell>
              <TableCell>{engineer.role}</TableCell>
              <TableCell className="capitalize">
                <Chip
                  color={colorMap[engineer.is_active ? "active" : "inactive"]}
                  status={engineer.is_active ? "active" : "inactive"}
                >
                  {engineer.is_active ? "Activo" : "Inactivo"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  {/* <Button variant="link" color="danger">
                    <span
                      className="text-lg text-danger cursor-pointer"
                      onClick={() => deleteEngineer(engineer.id)}
                    >
                      <DeleteIcon />
                    </span>
                  </Button> */}
                  <EditEngineers engineer={engineer} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};