import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import {
  Input,
  Button,
  Spacer,
  ModalFooter,
  user,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Swal from "sweetalert2";

export const FormMigrations = ({
  id,
  btnMigration,
  migration: initialMigration,
}) => {
  const { store, actions } = useContext(Context);
  const [provider, setProvider] = useState("");
  const navigate = useNavigate();
  const [migration, setMigration] = useState({
    installation_date: "",
    migration_date: "",
    migration_description: "",
    migration_status: "",
    provider_id: "",
    branch_id: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setMigration({ ...migration, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Cargando...",
      text: id
        ? "Espere mientras se actualiza la migración"
        : "Espere mientras se crea la migración",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        container: "custom-container",
        popup: "custom-popup",
        title: "custom-title",
        content: "custom-content",
        confirmButton: "custom-confirm-button",
      },
    });
    try {
      const response = id
        ? await actions.editMigration(
            id,
            migration.installation_date,
            migration.migration_date,
            migration.migration_description,
            migration.migration_status,
            migration.provider_id,
            migration.branch_id
          )
        : await actions.add_migration(
            migration.installation_date,
            migration.migration_date,
            migration.migration_description,
            migration.migration_status,
            migration.provider_id,
            migration.branch_id
          );
      Swal.fire({
        position: "center",
        icon: "success",
        title: id ? "Migracion Actualizada" : "Migracion creada correctamente",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: "custom-container",
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "custom-confirm-button",
        },
      });
      if (!id) {
        setMigration({
          installation_date: "",
          migration_date: "",
          migration_description: "",
          migration_status: "",
          user_id: "",
          provider_id: "",
          branch_id: "",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Hubo un problema: ${error.message}`,
        customClass: {
          container: "custom-container",
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "custom-confirm-button",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { value: "Ordered", label: "Ordenada" },
    { value: "In progress", label: "En proceso" },
    { value: "Completed", label: "Completada" },
  ];

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
    actions.getMigrations();
    if (initialMigration) {
      setMigration({
        installation_date: initialMigration.installation_date || "",
        migration_date: initialMigration.migration_date || "",
        migration_description: initialMigration.migration_description || "",
        migration_status: initialMigration.migration_status || "",
        user_id: initialMigration.user_id || "",
        provider_id: initialMigration.provider_id || "",
        branch_id: initialMigration.branch_id || "",
      });
    }
  }, []);
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Input
          label="Fecha de Instalación"
          name="installation_date"
          type="date"
          value={migration.installation_date}
          onChange={handleChange}
          required
        />
        <Input
          label="Fecha de Migración"
          name="migration_date"
          type="date"
          value={migration.migration_date}
          onChange={handleChange}
          required
        />
        <Input
          label="Descripción de la Migración"
          name="migration_description"
          value={migration.migration_description}
          onChange={handleChange}
          required
        />
        <Select
          label="Estado de la Migración"
          name="migration_status"
          value={migration.migration_status}
          onChange={handleChange}
          required
        >
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Selecciona un proveedor"
          name="provider_id"
          required
          value={migration.provider_id}
          onChange={handleChange}
        >
          {store.providers.map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              {provider.company_name}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Sucursal"
          name="branch_id"
          required
          value={migration.branch_id}
          onChange={handleChange}
        >
          {store.branchs.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.branch_cr}
            </SelectItem>
          ))}
        </Select>
      </div>
      <Spacer />
      <ModalFooter>
        <Button type="submit" color="primary" disabled={loading}>
          {btnMigration}
        </Button>
      </ModalFooter>
    </form>
  );
};
