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
  Switch,
} from "@nextui-org/react";
import Swal from "sweetalert2";

export const FormUsers_MB = ({ id, btnUserMB, userMB: initialUserMB }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [userMB, setUserMB] = useState({
    id: "",
    user_name_MB: "",
    is_active: "",
    names: "",
    last_names: "",
    employee_number: "",
    branch_id: "",
    asset_id: "",
    is_active: false,
  });
  const [branch, setBranch] = useState("");
  const [asset, setAsset] = useState("");


  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserMB({ ...userMB, [e.target.name]: e.target.value });
  };

  const setIs_activeOnOff = (checked) => {
    setUserMB({ ...userMB, is_active: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Cargando...",
      text: id
        ? "Espere mientras se actualiza el Usuario MB"
        : "espere mientras se crea el Usuario MB",
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
        ? await actions.editUserMB(
            id,
            userMB.user_name_MB,
            userMB.is_active,
            userMB.names,
            userMB.last_names,
            userMB.employee_number,
            userMB.branch_id,
            userMB.asset_id,
            userMB.is_active
          )
        : await actions.add_userMB(
            userMB.user_name_MB,
            userMB.is_active,
            userMB.names,
            userMB.last_names,
            userMB.employee_number,
            userMB.branch_id,
            userMB.asset_id,
            userMB.is_active
          );

      Swal.fire({
        position: "center",
        icon: "success",
        title: id
          ? "Usuario MB Actualizado"
          : "Usuario MB creado correctamente",
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
        setUserMB({
          user_name_MB: "",
          is_active: "",
          names: "",
          last_names: "",
          employee_number: "",
          branch_id: "",
          asset_id: "",
          is_active: false,
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
    actions.getUsersMB();
    actions.getAssets();
    if (initialUserMB) {
      getBranchById(initialUserMB.branch_id);
      getAssetById(initialUserMB.asset_id);
      setUserMB({
        user_name_MB: initialUserMB.user_name_MB || "",
        is_active: initialUserMB.is_active || "",
        names: initialUserMB.names || "",
        last_names: initialUserMB.last_names || "",
        employee_number: initialUserMB.employee_number || "",
        branch_id: initialUserMB.branch_id || "",
        asset_id: initialUserMB.asset_id || "",
        is_active: initialUserMB.is_active || false,
      });
    }
  }, []);



  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Input
          label="Nombre de Usuario MB"
          name="user_name_MB"
          value={userMB.user_name_MB}
          onChange={handleChange}
          required
        />
        <Input
          label="Nombres"
          name="names"
          value={userMB.names}
          onChange={handleChange}
          required
        />
        <Input
          label="Apellidos"
          name="last_names"
          value={userMB.last_names}
          onChange={handleChange}
          required
        />
        <Input
          label="Numero de Empleado"
          name="employee_number"
          value={userMB.employee_number}
          onChange={handleChange}
          required
        />

        <Select
          label="Sucursal"
          placeholder={branch ? branch.branch_cr : ""}
          name="branch_id"
          required
          value={userMB.branch_id}
          onChange={handleChange}
        >
          {store.branchs.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.branch_cr}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Activo"
          placeholder={asset ? asset.asset_inventory_number : ""}
          name="asset_id"
          required
          value={userMB.asset_id}
          onChange={handleChange}
        >
          {store.assets.map((asset) => (
            <SelectItem key={asset.id} value={asset.id}>
              {asset.asset_inventory_number}
            </SelectItem>
          ))}
        </Select>

        <div className="flex items-center">
          <Switch
            isSelected={userMB.is_active}
            onChange={(e) =>
              setUserMB({ ...userMB, is_active: e.target.checked })
            }
          />
          <label className="ml-2">Activo</label>
        </div>
      </div>
      <Spacer />
      <ModalFooter>
        <Button type="submit" color="primary" disabled={loading}>
          {btnUserMB}
        </Button>
      </ModalFooter>
    </form>
  );
};
