import React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateAdmins } from "./CreateAdmins.jsx";
import { EditAdmins } from "./EditAdmins.jsx";
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

const statusColorMap = {
    active: "success",
    inactive: "danger",
  };

export const Admins = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  useTokenExpiration();


  const filteredItems = useMemo(() => {
    let filteredAdmins = [...store.admins];

    if (filterValue) {
      filteredAdmins = filteredAdmins.filter((admin) =>
        admin.user_name
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    // Asegúrate de que 'status' esté en tus datos para filtrar adecuadamente
    if (statusFilter !== "all") {
      filteredAdmins = filteredAdmins.filter(
        (admin) => admin.is_active ? statusFilter === "active" : statusFilter === "inactive"
      );
    }

    return filteredAdmins;
  }, [store.admins, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const deleteAdmin = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar el Admins?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteAdmin(id).then(() => {
          Swal.fire("Admins eliminado correctamente", "", "success");
        });
      }
    });
  };

  const topContent = (
    <div className="flex justify-between gap-3 items-center">
      <div className="flex justify-start gap-3 items-center">
        <span className="text-default-400 text-lg">
          Total de Adminsistradores : {store.admins.length}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          isClearable
          placeholder="Buscar por Admins..."
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
          <CreateAdmins />
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
        <span className="text-lg font-bold">Adminsistradores</span>
      </div>
      <Table
        aria-label="Tabla de Adminsistradores"
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
          {items.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.id}</TableCell>
              <TableCell>{admin.user_name}</TableCell>
              <TableCell>{admin.names}</TableCell>
              <TableCell>{admin.last_names}</TableCell>
              <TableCell>{admin.employee_number}</TableCell>
              <TableCell>{admin.subzone}</TableCell>
              <TableCell>{admin.role}</TableCell>
              <TableCell>
                <Chip
                  color={statusColorMap[admin.is_active ? "active" : "inactive"]}
                  status={admin.is_active ? "active" : "inactive"}
                >
                  {admin.is_active ? "Activo" : "Inactivo"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                 {/* <Button variant="link" color="danger">
                    <span
                      className="text-lg text-danger cursor-pointer"
                      onClick={() => deleteAdmin(admin.id)}
                    >
                       <DeleteIcon /> 
                    </span>
                  </Button>*/}
                  <EditAdmins admin={admin} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};