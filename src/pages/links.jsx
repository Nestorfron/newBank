import React, { useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateLinks } from "../components/CreateLinks.jsx";
import { EditLinks } from "../components/EditLinks.jsx";
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

export const Links = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  useTokenExpiration();

  const filteredItems = useMemo(() => {
    let filteredLinks = [...store.links];

    if (filterValue) {
      filteredLinks = filteredLinks.filter((link) =>
        link.type
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        link.description
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        link.speed
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        link.status
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    // Asegúrate de que 'status' esté en tus datos para filtrar adecuadamente
    if (statusFilter !== "all") {
      filteredLinks = filteredLinks.filter(
        (link) => link.status === statusFilter // Cambia según tus datos
      );
    }

    return filteredLinks;
  }, [store.links, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const deleteLink = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar el Link?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteLink(id).then(() => {
          Swal.fire("Link eliminado correctamente", "", "success");
        });
      }
    });
  };

  const topContent = (
    <div className="flex justify-between gap-3 items-center">
      <div className="flex justify-start gap-3 items-center">
        <span className="text-default-400 text-lg">
          Total de Links : {store.links.length}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          isClearable
          placeholder="Buscar por Link..."
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
          className="w-full"
          startContent={<SearchIcon />}
        />
        <div>
          <CreateLinks />
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
    actions.getLinks();
  }, []);    

  return (
    <div className="m-5">
      <div className="flex justify-start gap-4 mt-4 mb-4">
        <span className="text-lg font-bold">Gestor de Links</span>
      </div>
      <Table
        aria-label="Tabla de links"
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
          <TableColumn>Tipo</TableColumn>
          <TableColumn>Descripción</TableColumn>
          <TableColumn>Velocidad</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((link) => (
            <TableRow key={link.id}>
              <TableCell>{link.id}</TableCell>
              <TableCell>{link.type}</TableCell>
              <TableCell>{link.description}</TableCell>
              <TableCell>{link.speed}</TableCell>
              <TableCell>{link.status}</TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Button variant="link" color="danger">
                    <span
                      className="text-lg text-danger cursor-pointer"
                      onClick={() => deleteLink(link.id)}
                    >
                      <DeleteIcon />
                    </span>
                  </Button>
                  <EditLinks link={link} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};