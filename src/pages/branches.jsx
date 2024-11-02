import React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateBranches } from "../components/CreateBranches.jsx";
import { EditBranches } from "../components/EditBranches.jsx";
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
import AssetsListBranch from "../components/assetsListBranch.jsx";
import MigrationsListBranch from "../components/migrationsListBranch.jsx";
import HistoryListBranch from "../components/historyListBranch.jsx";

export const Branches = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  useTokenExpiration();

  const filteredItems = useMemo(() => {
    let filteredBranches = [...store.branchs];

    if (filterValue) {
      filteredBranches = filteredBranches.filter((branch) =>
        branch.branch_cr.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Asegúrate de que 'status' esté en tus datos para filtrar adecuadamente
    if (statusFilter !== "all") {
      filteredBranches = filteredBranches.filter(
        (branch) => branch.status === statusFilter // Cambia según tus datos
      );
    }

    return filteredBranches;
  }, [store.branchs, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const deleteBranch = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar la Sucursal?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteBranch(id).then(() => {
          Swal.fire("Sucursal eliminada correctamente", "", "success");
        });
      }
    });
  };

  const topContent = (
    <div className="flex justify-between gap-3 items-center">
      <div className="flex justify-start gap-3 items-center">
        <span className="text-default-400 text-lg">
          Total de Sucursales : {store.branchs.length}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          isClearable
          placeholder="Buscar por Sucursal..."
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
          className="w-full"
          startContent={<SearchIcon />}
        />
        <div>
          <CreateBranches />
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
    actions.getBranchs()
  }, []);

  return (
    <div className="m-5">
      <div className="flex justify-start gap-4 mt-4 mb-4">
        <span className="text-lg font-bold">Gestor de Sucursales</span>
      </div>
      <Table
        aria-label="Tabla de sucursales"
        isStriped
        isHeaderSticky
        topContent={topContent}
        bottomContent={bottomContent}
        classNames={{
          td: "text-center w-32",
          th: "text-center",
        }}
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Cr</TableColumn>
          <TableColumn>Zona</TableColumn>
          <TableColumn>SubZona</TableColumn>
          <TableColumn>Dirección</TableColumn>
          <TableColumn>Activos</TableColumn>
          <TableColumn>Migrations</TableColumn>
          <TableColumn>Historial</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell>{branch.id}</TableCell>
              <TableCell>{branch.branch_cr}</TableCell>
              <TableCell>{branch.branch_zone}</TableCell>
              <TableCell>{branch.branch_subzone}</TableCell>
              <TableCell>{branch.branch_address}</TableCell>
              <TableCell className="justify-center"> {branch.assets.length > 0 ? <AssetsListBranch branch={branch}/> : <p className="text-center text-gray-500 m-auto">Sin Activos</p>} </TableCell>
              <TableCell className="justify-center"> {branch.migrations.length > 0 ? <MigrationsListBranch branch={branch}/> : <p className="text-center text-gray-500 m-auto">Sin Migraciones</p>} </TableCell>
              <TableCell className="justify-center"> {branch.history.length > 0 ? <HistoryListBranch branch={branch}/> : <p className="text-center text-gray-500 m-auto">Sin Historial</p>} </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Button variant="link" color="danger">
                    <span
                      className="text-lg text-danger cursor-pointer"
                      onClick={() => deleteBranch(branch.id)}
                    >
                      <DeleteIcon />
                    </span>
                  </Button>
                  <EditBranches branch={branch} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
