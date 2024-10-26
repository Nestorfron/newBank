import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import {
  Input,
  Button,
  Spacer,
  ModalFooter,
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
  const [branch, setBranch] = useState("");
  const navigate = useNavigate();
  const [migration, setMigration] = useState({
    installation_date: "",
    migration_date: "",
    migration_description: "",
    migration_status: "",
    provider_id: "",
    branch_id: "",
    user_id: null,
    admins_id: null,
    engineer_id: null,
  });

  const me = store.me;

  const [loading, setLoading] = useState(false);

  const addId = ()  => {
    if (me.role === "Master") {
      setMigration({ ...migration, user_id: me.id });
    } else if (me.role === "Admin") {
      setMigration({ ...migration, admins_id: me.id });
    } else if (me.role === "Ingeniero de Campo") {
      setMigration({ ...migration, engineer_id: me.id });
    }
  }

  const parseDateString = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
            migration.branch_id,
            migration.user_id,
            migration.admins_id,
            migration.engineer_id
          )
        : await actions.add_migration(
            migration.installation_date,
            migration.migration_date,
            migration.migration_description,
            migration.migration_status,
            migration.provider_id,
            migration.branch_id,
            migration.user_id,
            migration.admins_id,
            migration.engineer_id
          );
      Swal.fire({
        position: "center",
        icon: "success",
        title: id ? "Migración Actualizada" : "Migración creada correctamente",
        showConfirmButton: false,
        timer: 1500,
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
          user_id: null,
          admins_id: null,
          engineer_id: null,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Hubo un problema: ${error.message}`,
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

  const getBranchById = (branchId) => {
    const Branch = store.branchs.find(
      (branch) => branch.id === branchId
    );
    setBranch(Branch);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getMigrations();
    actions.getMe();
    addId();
    if (initialMigration) {
      getProviderById(initialMigration.provider_id);
      getBranchById(initialMigration.branch_id);
      setMigration({
        installation_date: parseDateString(initialMigration.installation_date) || "",
        migration_date: parseDateString(initialMigration.migration_date) || "",
        migration_description: initialMigration.migration_description || "",
        migration_status: initialMigration.migration_status || "",
        user_id: initialMigration.user_id || "",
        provider_id: initialMigration.provider_id || "",
        branch_id: initialMigration.branch_id || "",
        user_id: initialMigration.user_id || null,
        admins_id: initialMigration.admins_id || null,
        engineer_id: initialMigration.engineer_id || null,
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
          placeholder={migration.migration_status}
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
          placeholder={provider ? provider.company_name : ""}
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
          placeholder={branch ? branch.branch_cr : ""}
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
