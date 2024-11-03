import React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateMigrations } from "../components/CreateMigration.jsx";
import { EditMigrations } from "../components/EditMigrations.jsx";
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

export const Migrations = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  useTokenExpiration();

  const me = store.me;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const filteredItems = useMemo(() => {
    let filteredMigrations = [...store.migrations];

    if (filterValue) {
      filteredMigrations = filteredMigrations.filter((migration) =>
        [migration.installation_date, migration.migration_date, migration.migration_description, migration.migration_status, migration.provider_id, migration.branch_id].some(field => 
          field ? field.toString().toLowerCase().includes(filterValue.toLowerCase()) : false
        )
      );
    }

    if (statusFilter !== "all") {
      filteredMigrations = filteredMigrations.filter(
        (migration) => migration.migration_status === statusFilter
      );
    }

    return filteredMigrations;
  }, [store.migrations, filterValue, statusFilter]);


  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const deleteMigration = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar la Migración?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteMigration(id).then(() => {
          Swal.fire("Migración eliminada correctamente", "", "success");
        });
      }
    });
  };

  const topContent = (
    <div className="flex justify-between gap-3 items-center">
      <span className="text-default-400 text-lg">
        Total de Migraciones: {store.migrations.length}
      </span>
      <div className="flex gap-2 items-center">
        <Input
          isClearable
          placeholder="Buscar por Migración..."
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
          className="w-full"
          startContent={<SearchIcon />}
        />
        <CreateMigrations />
      </div>
    </div>
  );

  const bottomContent = (
    <div className="flex justify-center mt-4">
      <Pagination showControls page={page} total={pages} onChange={setPage} />
    </div>
  );


  const mapColor = (status) => {
    if (status === "Ordered") {
      return "success";
    } else if (status === "In_progress") {
      return "warning";
    } else if (status === "Completed") {
      return "danger";
    }
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getMe();
    actions.getMigrations();
    actions.getBranchs();
    actions.getProviders();
  }, []);

  return (
    <div className="m-5">
      <div className="flex justify-start gap-4 mt-4 mb-4">
        <span className="text-lg font-bold">Gestor de Migraciones</span>
      </div>
      <Table
        aria-label="Tabla de migraciones"
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
          <TableColumn>Fecha de Instalación</TableColumn>
          <TableColumn>Fecha de Migración</TableColumn>
          <TableColumn>Descripción de Migración</TableColumn>
          <TableColumn>Estado de Migración</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((migration) => (
            <TableRow key={migration.id}>
              <TableCell>{migration.id}</TableCell>
              <TableCell>{formatDate(migration.installation_date)}</TableCell>
              <TableCell>{formatDate(migration.migration_date)}</TableCell>
              <TableCell>{migration.migration_description}</TableCell>
              <TableCell className="capitalize">
                <Chip
                  color={mapColor(migration.migration_status)}
                  status={migration.migration_status}
                >
                  {migration.migration_status === "Ordered" ? "Ordenada" : ""}
                  {migration.migration_status === "In_progress" ? "En proceso" : ""}
                  {migration.migration_status === "Completed" ? "Completada" : ""}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                 {store.me.role == "Master" ? 
                    <Button variant="link" color="danger">
                    <span
                      className="text-lg text-danger cursor-pointer"
                      onClick={() => deleteMigration(migration.id)}
                    >
                      <DeleteIcon />
                    </span>
                  </Button>: null}
                  <EditMigrations migration={migration} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
