import React, { useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
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
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";
import { SearchIcon } from "../assets/icons/SearchIcon.jsx";
import { CreateAssets } from "../components/CreateAsset.jsx";
import { EditAssets } from "../components/EditAssets.jsx";
import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";
import MigrationsList from "../components/migrationsList.jsx";

export const Assets = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [provider, setProvider] = useState("");

  useTokenExpiration();

  const filteredItems = useMemo(() => {
    let filteredAssets = [...store.assets];

    if (filterValue) {
      filteredAssets = filteredAssets.filter((asset) =>
        (asset.asset_type?.toLowerCase().includes(filterValue.toLowerCase()) || 
         asset.asset_brand?.toLowerCase().includes(filterValue.toLowerCase()) || 
         asset.asset_model?.toLowerCase().includes(filterValue.toLowerCase()) || 
         asset.asset_serial?.toLowerCase().includes(filterValue.toLowerCase()) || 
         asset.asset_inventory_number?.toLowerCase().includes(filterValue.toLowerCase()) || 
         asset.asset_provider?.toLowerCase().includes(filterValue.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filteredAssets = filteredAssets.filter(
        (asset) => asset.asset_type === statusFilter
      );
    }

    return filteredAssets;
  }, [store.assets, filterValue, statusFilter]);


  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const deleteAsset = (id) => {
    Swal.fire({
      title: "Advertencia",
      text: "¿Desea eliminar el Activo?",
      icon: "warning",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Sí",
    }).then((click) => {
      if (click.isConfirmed) {
        actions.deleteAsset(id).then(() => {
          Swal.fire("Activo eliminado correctamente", "", "success");
        });
      }
    });
  };

  const topContent = (
    <div className="flex justify-between gap-3 items-center">
      <div className="flex justify-start gap-3 items-center">
        <span className="text-default-400 text-lg">
          Total de Activos : {store.assets.length}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          isClearable
          placeholder="Buscar por Activo..."
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
          className="w-full"
          startContent={<SearchIcon />}
        />
        <div>
          <CreateAssets />
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
    actions.getAssets();
    actions.getProviders();
  }, []);

  return (
    <div className="m-5">
      <div className="flex justify-start gap-4 mt-4 mb-4">
        <span className="text-lg font-bold">Gestor de Activos</span>
      </div>
      <Table
        aria-label="Tabla de activos"
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
          <TableColumn>Tipo</TableColumn>
          <TableColumn>Marca</TableColumn>
          <TableColumn>Modelo</TableColumn>
          <TableColumn>No. Serial</TableColumn>
          <TableColumn>No. Inventario</TableColumn>
          <TableColumn>Proveedor</TableColumn>
          <TableColumn>Sucursal</TableColumn>
          <TableColumn>Migraciones</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.asset_type}</TableCell>
              <TableCell>{asset.asset_brand}</TableCell>
              <TableCell>{asset.asset_model}</TableCell>
              <TableCell>{asset.asset_serial}</TableCell>
              <TableCell>{asset.asset_inventory_number}</TableCell>
              <TableCell>{asset.provider_id ? store.providers.find(provider => provider.id === asset.provider_id).company_name : "No asignado"}</TableCell>
              <TableCell>{asset.branch_id ? store.branchs.find(branch => branch.id === asset.branch_id).branch_cr : "No asignado"}</TableCell>
              <TableCell> {asset.migrations.length > 0 ? <MigrationsList asset={asset}/> : "Sin Migraciones"}</TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Button variant="link" color="danger">
                    <span
                      className="text-lg text-danger cursor-pointer"
                      onClick={() => deleteAsset(asset.id)}
                    >
                      <DeleteIcon />
                    </span>
                  </Button>
                  <EditAssets asset={asset} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
