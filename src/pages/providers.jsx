import React, { useContext, useMemo, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CreateProviders } from "../components/CreateProviders.jsx";
import { EditProviders } from "../components/EditProviders.jsx";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { EngineersList } from "../components/engineersList.jsx";



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
  Accordion,
  AccordionItem,
} from "@nextui-org/react";

export const Providers = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filteredProviders = useMemo(() => {
    let filteredProviders = [...store.providers];

    if (filterValue) {
      filteredProviders = filteredProviders.filter((provider) =>
        provider.company_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filteredProviders = filteredProviders.filter(
        (provider) => provider.status === statusFilter // Cambia según tus datos
      );
    }
    return filteredProviders;
  }, [store.providers, filterValue, statusFilter]);

  const pages = Math.ceil(filteredProviders.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredProviders.slice(start, start + rowsPerPage);
  }, [page, filteredProviders, rowsPerPage]);

  const deleteProvider = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar el Proveedor?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteProvider(id).then(() => {
          Swal.fire("Proveedor eliminado correctamente", "", "success");
        });
      }
    });
  };

  const topContent = (
    <div className="flex justify-between gap-3 items-center">
      <div className="flex justify-start gap-3 items-center">
        <span className="text-default-400 text-lg">
          Total de Proveedores : {store.providers.length}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          isClearable
          placeholder="Buscar por Proveedor..."
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
          className="w-full"
          startContent={<SearchIcon />}
        />
        <div>
          <CreateProviders />
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
    actions.getProviders();
    actions.getBranchs();
  }, []);

  return (
    <div className="m-5">
      <div className="flex justify-start gap-4 mt-4 mb-4">
        <span className="text-lg font-bold">Gestor de Provedores</span>
      </div>
      <Table
        aria-label="Tabla de proveedores"
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
          <TableColumn>#</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>RFC</TableColumn>
          <TableColumn>Servicio</TableColumn>
          <TableColumn>Ingenieros de Campo</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((provider) => (
            <TableRow key={provider.id}>
              <TableCell>{provider.id}</TableCell>
              <TableCell>{provider.company_name}</TableCell>
              <TableCell>{provider.rfc}</TableCell>
              <TableCell>{provider.service}</TableCell>
              <TableCell>
                {provider.engineers.length ? (<EngineersList provider={provider}/>) : "Sin Ingenieros"}
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Button
                    variant="link"
                    className="text-lg text-danger cursor-pointer"
                    onClick={() => deleteProvider(provider.id)}
                  >
                    <DeleteIcon />
                  </Button>
                  <EditProviders provider={provider} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
