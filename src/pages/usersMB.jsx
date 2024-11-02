import React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateUsersMB } from "../components/CreateUsersMB.jsx";
import { EditUsersMB } from "../components/EditUsersMB.jsx";
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
} from "@nextui-org/react";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";
import AddAsset from "../components/addAsset.jsx";
import AssetsList from "../components/assetsList.jsx";


export const UsersMB = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  useTokenExpiration();

  const filteredItems = useMemo(() => {
    let filteredUsersMB = [...store.usersMB];

    if (filterValue) {
      filteredUsersMB = filteredUsersMB.filter(
        (userMB) =>
          userMB.user_name_MB
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          userMB.names.toLowerCase().includes(filterValue.toLowerCase()) ||
          userMB.last_names.toLowerCase().includes(filterValue.toLowerCase()) ||
          userMB.employee_number
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }

    // Asegúrate de que 'status' esté en tus datos para filtrar adecuadamente
    if (statusFilter !== "all") {
      filteredUsersMB = filteredUsersMB.filter(
        (userMB) => userMB.status === statusFilter // Cambia según tus datos
      );
    }

    return filteredUsersMB;
  }, [store.usersMB, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const deleteUserMB = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar Usuario MB?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteUserMB(id).then(() => {
          Swal.fire("Usuario MB eliminado correctamente", "", "success");
        });
      }
    });
  };

  const topContent = (
    <div className="flex justify-between gap-3 items-center">
      <div className="flex justify-start gap-3 items-center">
        <span className="text-default-400 text-lg">
          Total de Usuarios MB : {store.usersMB.length}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          isClearable
          placeholder="Buscar por Usuario MB..."
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
          className="w-full"
          startContent={<SearchIcon />}
        />
        <div>
          <CreateUsersMB />
        </div>
      </div>
    </div>
  );

  const bottomContent = (
    <div className="flex justify-center mt-4">
      <Pagination showControls page={page} total={pages} onChange={setPage} />
    </div>
  );

  const statusColorMap = {
    active: "success",
    inactive: "danger",
  };

  

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getUsersMB();
    actions.getMe();
    actions.getBranchs();
    actions.getAssets();
  }, []);

  return (
    <div className="m-5">
      <div className="flex justify-start gap-4 mt-4 mb-4">
        <span className="text-lg font-bold">Gestor de Usuarios MB</span>
      </div>
      <Table
        aria-label="Tabla de Usuarios MB"
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
          <TableColumn>Estado</TableColumn>
          <TableColumn>Nombres</TableColumn>
          <TableColumn>Apellidos</TableColumn>
          <TableColumn>Numero de Empleado</TableColumn>
          <TableColumn>Sucursal</TableColumn>
          <TableColumn>Activos Adjudicados</TableColumn>
          <TableColumn>Telefono</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((userMB) => (
            <TableRow key={userMB.id}>
              <TableCell>{userMB.id}</TableCell>
              <TableCell>
                <Chip
                  color={statusColorMap[userMB.is_active ? "active" : "inactive"]}
                  status={userMB.is_active ? "active" : "inactive"}
                >
                  {userMB.is_active ? "Activo" : "Inactivo"}
                </Chip>
              </TableCell>
              <TableCell>{userMB.names}</TableCell>
              <TableCell>{userMB.last_names}</TableCell>
              <TableCell>{userMB.employee_number}</TableCell>
              <TableCell>{userMB.branch_id}</TableCell>
              <TableCell className="flex justify-center"> {userMB.assets.length > 0 ? <AssetsList userMB={userMB}/> : "Sin Activos"} <AddAsset userMB={userMB}  /></TableCell>
              <TableCell>{userMB.extension_phone}</TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Button variant="link" color="danger">
                    <span
                      className="text-lg text-danger cursor-pointer"
                      onClick={() => deleteUserMB(userMB.id)}
                    >
                      <DeleteIcon />
                    </span>
                  </Button>
                  <EditUsersMB userMB={userMB} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
