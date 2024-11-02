import React, { useContext, useEffect, useState, useMemo } from "react";
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


export const FormAssets = ({ id, btnAsset, asset: initialAsset }) => {
  const { store, actions } = useContext(Context);
  const [provider, setProvider] = useState("");
  const [branch, setBranch] = useState("");
  const [userMB, setUserMB] = useState("");
  const [migration, setMigration] = useState("");
  const navigate = useNavigate();
  const [asset, setAsset] = useState({
    asset_type: "",
    asset_brand: "",
    asset_model: "",
    asset_serial: "",
    asset_inventory_number: "",
    provider_id: "",
    branch_id: null,
    user_id: null,
    admins_id: null,
    engineer_id: null,
    user_mb_id: null,
  });

  const me = store.me;

  const [loading, setLoading] = useState(false);

  const addId = ()  => {
    if (me.role === "Master") {
      setAsset({ ...asset, user_id: me.id });
    } else if (me.role === "Admin") {
      setAsset({ ...asset, admins_id: me.id });
    } else if (me.role === "Ingeniero de Campo") {
      setAsset({ ...asset, engineer_id: me.id });
    }
  }

  const handleChange = (e) => {
    setAsset({ ...asset, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Cargando...",
      text: id
        ? "Espere mientras se actualiza el Activo"
        : "espere mientras se crea el Activo",
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
        ? await actions.editAsset(
            id,
            asset.asset_type,
            asset.asset_brand,
            asset.asset_model,
            asset.asset_serial,
            asset.asset_inventory_number,
            asset.provider_id,
            asset.branch_id,
            asset.user_id,
            asset.admins_id,
            asset.engineer_id,
            asset.user_mb_id
          )
        : await actions.add_asset(
            asset.asset_type,
            asset.asset_brand,
            asset.asset_model,
            asset.asset_serial,
            asset.asset_inventory_number,
            asset.provider_id,
            asset.branch_id,
            asset.user_id,
            asset.admins_id,
            asset.engineer_id,
            asset.user_mb_id
          );
      Swal.fire({
        position: "center",
        icon: "success",
        title: id ? "Activo Actualizado" : "Activo creado correctamente",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: "custom-container",
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "custom-confirm-button",
        },
      }).then(() => {});
      if (!id) {
        setAsset({
          asset_type: "",
          asset_brand: "",
          asset_model: "",
          asset_serial: "",
          asset_inventory_number: "",
          provider_id: "",
          branch_id: null,
          user_id: null,
          admins_id: null,
          engineer_id: null,
          user_mb_id: null
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

  const getUserMBById = (userMBId) => {
    const UserMB = store.usersMB.find(
      (userMB) => userMB.id === userMBId
    );
    setUserMB(UserMB);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getProviders();
    actions.getBranchs();
    actions.getUsersMB();
    actions.getMe();
    addId();
    if (initialAsset) {
      getProviderById(initialAsset.provider_id);
      getBranchById(initialAsset.branch_id);
      getUserMBById(initialAsset.user_mb_id);
      setAsset({
        id: initialAsset.id,
        asset_type: initialAsset.asset_type || "",
        asset_brand: initialAsset.asset_brand || "",
        asset_model: initialAsset.asset_model || "",
        asset_serial: initialAsset.asset_serial || "",
        asset_inventory_number: initialAsset.asset_inventory_number || "",
        provider_id: initialAsset.provider_id || null,
        branch_id: initialAsset.branch_id || null,
        user_id: initialAsset.user_id || null,
        admins_id: initialAsset.admins_id || null,
        engineer_id: initialAsset.engineer_id || null,
        user_mb_id: initialAsset.user_mb_id || null
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Input
          label="Tipo"
          
          name="asset_type"
          value={asset.asset_type}
          onChange={handleChange}
          required
        />
        <Input
          label="Marca"
          
          name="asset_brand"
          value={asset.asset_brand}
          onChange={handleChange}
          required
        />
        <Input
          label="Modelo de Activo"
          
          name="asset_model"
          value={asset.asset_model}
          onChange={handleChange}
          required
        />
        <Input
          label="Numero de Serial"
          
          name="asset_serial"
          value={asset.asset_serial}
          onChange={handleChange}
          required
        />
        <Input
          label="Numero de Inventario de Activo"
          
          name="asset_inventory_number"
          value={asset.asset_inventory_number}
          onChange={handleChange}
          required
        />
        <Select
          label="Proveedor"
          placeholder={provider ? provider.company_name : ""}
          name="provider_id"
          required
          value={asset.provider_id}
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
          value={asset.branch_id}    
          onChange={handleChange}
        >
          {store.branchs.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.branch_cr}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Usuario MB"
          placeholder={userMB ? userMB.names : ""}
          name="user_mb_id"
          value={asset.user_mb_id}    
          onChange={handleChange}
        >
          {store.usersMB.map((userMB) => (
            <SelectItem key={userMB.id} value={userMB.id}>
              {userMB.names}
            </SelectItem>
          ))}
        </Select>
      </div>
      <Spacer />
      <ModalFooter>
        <Button type="submit" color="primary" disabled={loading}>
          {btnAsset}
        </Button>
      </ModalFooter>
    </form>
  );
};
