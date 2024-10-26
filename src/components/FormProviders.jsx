import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

export const FormProviders = ({
  id,
  btnProvider,
  provider: initialProvider,
}) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [provider, setProvider] = useState({
    branch_id: "",
    company_name: "",
    rfc: "",
    service: "",
    user_id: null,
    admins_id: null,
    engineer_id: null,
  });
  const [branch, setBranch] = useState("");

  const me = store.me;

  const [loading, setLoading] = useState(false);

  const addId = ()  => {
    if (me.role === "Master") {
      setBranch({ ...branch, user_id: me.id });
    } else if (me.role === "Admin") {
      setBranch({ ...branch, admins_id: me.id });
    } else if (me.role === "Ingeniero de Campo") {
      setBranch({ ...branch, engineer_id: me.id });
    }
  }
  
  const handleChange = (e) => {
    setProvider({ ...provider, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Cargando...",
      text: id
        ? "Espere mientras se actualiza el Proveedor"
        : "Espere mientras se crea el Proveedor",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = id
        ? await actions.editProvider(
            id,
            provider.branch_id,
            provider.company_name,
            provider.rfc,
            provider.service,
            provider.user_id,
            provider.admins_id,
            provider.engineer_id
          )
        : await actions.add_provider(
            provider.branch_id,
            provider.company_name,
            provider.rfc,
            provider.service,
            provider.user_id,
            provider.admins_id,
            provider.engineer_id
          );

      Swal.fire({
        position: "center",
        icon: "success",
        title: id ? "Proveedor Actualizado" : "Proveedor creado correctamente",
        showConfirmButton: false,
        timer: 1500,
      });

      if (!id) {
        setProvider({
          branch_id: "",
          company_name: "",
          rfc: "",
          service: "",
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
    actions.getProviders();
    actions.getBranchs();
    actions.getMe();
    addId();
    if (initialProvider) {
      getBranchById(initialProvider.branch_id);
      setProvider({
        branch_id: initialProvider.branch_id,
        company_name: initialProvider.company_name || "",
        rfc: initialProvider.rfc || "",
        service: initialProvider.service || "",
        user_id: initialProvider.user_id || null,
        admins_id: initialProvider.admins_id || null,
        engineer_id: initialProvider.engineer_id || null,
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Select
          label="Sucursal"
          name="branch_id"
          placeholder={branch ? branch.branch_cr : ""}
          value={provider.branch_id}
          onChange={(e) =>
            setProvider({ ...provider, branch_id: e.target.value })
          }
          required
        >
          {store.branchs.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.branch_cr}
            </SelectItem>
          ))}
        </Select>

        <Input
          label="Nombre de la Compañia"
          name="company_name"
          value={provider.company_name}
          onChange={handleChange}
          required
        />

        <Input
          label="RFC"
          name="rfc"
          value={provider.rfc}
          onChange={handleChange}
          required
        />

        <Input
          label="Servicio"
          name="service"
          value={provider.service}
          onChange={handleChange}
          required
        />

        <div className="flex justify-end">
          <Button type="submit" color="primary" disabled={loading}>
            {btnProvider}
          </Button>
        </div>
      </div>
    </form>
  );
};
