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

export const FormLinks = ({ id, btnLink, link: initialLink }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [link, setLink] = useState({
    type: "",
    description: "",
    speed: "",
    status: "",
    user_id: null,
    admins_id: null,
    engineer_id: null,
    provider_id: null,
    branch_id: null,
  });
  const [provider, setProvider] = useState("");
  const [branch, setBranch] = useState("");

  const me = store.me;

  const [loading, setLoading] = useState(false);

  const addId = ()  => {
    if (me.role === "Master") {
      setLink({ ...link, user_id: me.id });
    } else if (me.role === "Admin") {
      setLink({ ...link, admins_id: me.id });
    } else if (me.role === "Ingeniero de Campo") {
      setLink({ ...link, engineer_id: me.id });
    }
  }

  const handleChange = (e) => {
    setLink({ ...link, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Cargando...",
      text: id
        ? "Espere mientras se actualiza el Link"
        : "Espere mientras se crea el Link",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = id
        ? await actions.editLink(
            id,
            link.type,
            link.description,
            link.speed,
            link.status,
            link.user_id,
            link.admins_id,
            link.engineer_id,
            link.provider_id,
            link.branch_id
          )
        : await actions.add_link(
            link.type,
            link.description,
            link.speed,
            link.status,
            link.user_id,
            link.admins_id,
            link.engineer_id,
            link.provider_id,
            link.branch_id
          );
      Swal.fire({
        position: "center",
        icon: "success",
        title: id ? "Link Actualizado" : "Link creado correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
      if (!id) {
        setLink({
          type: "",
          description: "",
          speed: "",
          status: "",
          user_id: null,
          admins_id: null,
          engineer_id: null,
          provider_id: null,
          branch_id: null,
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
    // const jwt = localStorage.getItem("token");
    // if (!jwt) {
    //   navigate("/");
    //   return;
    // }
    actions.getLinks();
    actions.getProviders();
    actions.getBranchs();
    actions.getMe();
    addId();
    if (initialLink) {
        getProviderById(initialLink.provider_id);
        getBranchById(initialLink.branch_id);
      setLink({
        type: initialLink.type || "",
        description: initialLink.description || "",
        speed: initialLink.speed || "",
        status: initialLink.status || "",
        user_id: initialLink.user_id || null,
        admins_id: initialLink.admins_id || null,
        engineer_id: initialLink.engineer_id || null,
        provider_id: initialLink.provider_id || null,
        branch_id: initialLink.branch_id || null,
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Input
          label="Tipo"
          name="type"
          value={link.type}
          onChange={handleChange}
          required
        />
        <Input
          label="Descripción"
          name="description"
          value={link.description}
          onChange={handleChange}
          required
        />
        <Input
          label="Velocidad"
          name="speed"
          value={link.speed}
          onChange={handleChange}
          required
        />
        <Input
          label="Estado"
          name="status"
          value={link.status}
          onChange={handleChange}
          required
        />
        <Select
          label="Proveedor"
          name="provider_id"
          placeholder={provider ? provider.company_name : ""}
          value={link.provider_id}
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
          placeholder={branch ? branch.branch_cr : ""}
          name="branch_id"
          value={link.branch_id}    
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
          {btnLink}
        </Button>
      </ModalFooter>
    </form>
  );
};  