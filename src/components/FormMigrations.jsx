import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import { CheckCircle } from "lucide-react";
import Swal from "sweetalert2";

export const FormMigrations = ({ id, btnMigration, migration: initialMigration }) => {
  const { store, actions } = useContext(Context);
  const [provider, setProvider] = useState("");
  const [branch, setBranch] = useState("");
  const [asset, setAsset] = useState("");
  const [migration, setMigration] = useState({
    installation_date: "",
    migration_date: "",
    migration_description: "",
    migration_status: "",
    provider_id: "",
    branch_id: "",
    asset_id: null,
    user_id: null,
    admins_id: null,
    engineer_id: null,
  });

  const me = store.me;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: "Información General",
      fields: ["installation_date", "migration_date", "migration_description", "migration_status"],
    },
    {
      title: "Proveedor y Sucursal",
      fields: ["provider_id", "branch_id"],
    },
    {
      title: "Activo",
      fields: ["asset_id"],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMigration({ ...migration, [name]: value });
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
            migration.asset_id
          )
        : await actions.add_migration(
            migration.installation_date,
            migration.migration_date,
            migration.migration_description,
            migration.migration_status,
            migration.provider_id,
            migration.branch_id,
            migration.asset_id
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
          provider_id: "",
          branch_id: "",
          asset_id: null,
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

  const isStepComplete = (step) => {
    return steps[step].fields.every(
      (field) => migration[field] !== "" && migration[field] !== null
    );
  };

  const allStepsComplete = steps.every((_, index) => isStepComplete(index));

  

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

  const getAssetById = (assetId) => {
    const Asset = store.assets.find(
      (asset) => asset.id === assetId
    );
    setAsset(Asset);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");  
      return;
    }
    actions.getMigrations();
    actions.getProviders();
    actions.getBranchs();
    actions.getMe();

    if (initialMigration) {
      getProviderById(initialMigration.provider_id);
      getBranchById(initialMigration.branch_id);
      getAssetById(initialMigration.asset_id);
      setMigration({
        installation_date:initialMigration.installation_date || "",
        migration_date:initialMigration.migration_date || "",
        migration_description: initialMigration.migration_description || "",
        migration_status: initialMigration.migration_status || "",
        provider_id: initialMigration.provider_id || "",
        branch_id: initialMigration.branch_id || "",
        asset_id: initialMigration.asset_id || null,
        user_id: initialMigration.user_id || null,
        admins_id: initialMigration.admins_id || null,
        engineer_id: initialMigration.engineer_id || null,
      });
    }
  }, []);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <h2>{id ? "Editar Migración" : "Nueva Migración"}</h2>
      </CardHeader>
      <CardBody>
        {/* Barra de Pasos */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <Button
                key={index}
                variant={activeStep === index ? "default" : "outline"}
                onClick={() => setActiveStep(index)}
                disabled={index > 0 && !isStepComplete(index - 1)}
                className="flex items-center"
              >
                {isStepComplete(index) ? (
                  <CheckCircle className="mr-2 text-success" />
                ) : null}
                {step.title}
              </Button>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Formulario: Campos del Paso Actual */}
        <div className="space-y-4">
          {steps[activeStep].fields.map((field) => (
            <div key={field}>
              {field === "migration_status" ? (
                <Select
                  label="Estado de la Migración"
                  name="migration_status"
                  value={migration.migration_status}
                  onChange={handleChange}
                  required
                >
                  {["Ordered", "In_progress", "Completed"].map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </Select>
              ) : field === "provider_id" ? (
                <Select
                  label="Selecciona un proveedor"
                  name="provider_id"
                  value={migration.provider_id}
                  onChange={handleChange}
                  required
                >
                  {store.providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.company_name}
                    </SelectItem>
                  ))}
                </Select>
              ) : field === "branch_id" ? (
                <Select
                  label="Sucursal"
                  name="branch_id"
                  value={migration.branch_id}
                  onChange={handleChange}
                  required
                >
                  {store.branchs.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.branch_cr}
                    </SelectItem>
                  ))}
                </Select>
              ) : field === "asset_id" ? (
                <Select
                  label="Activo"
                  name="asset_id"
                  value={migration.asset_id}
                  onChange={handleChange}
                  required
                >
                  {store.assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {`${asset.asset_type} - ${asset.asset_brand} - ${asset.asset_model} - ${asset.asset_serial}`}
                    </SelectItem>
                  ))}
                </Select>
              ) : (
                <Input
                  label={field.replace("_", " ").toUpperCase()}
                  name={field}
                  value={migration[field]}
                  onChange={handleChange}
                  required
                  type={field.includes("date") ? "date" : "text"}
                />
              )}
            </div>
          ))}
        </div>
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button onClick={() => setActiveStep(0)} color="error">
          Cancelar
        </Button>
        {activeStep < steps.length - 1 ? (
          <Button
            onClick={() => setActiveStep(activeStep + 1)}
            disabled={!isStepComplete(activeStep)}
          >
            Siguiente
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!allStepsComplete}>
            {id ? "Actualizar Migración" : "Crear Migración"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
