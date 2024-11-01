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
  Switch,
 
} from "@nextui-org/react";
import{
  Plus,
}from "lucide-react";
import Swal from "sweetalert2";
import { DeleteIcon } from "../assets/icons/DeleteIcon.jsx";

export const FormUsers_MB = ({ id, btnUserMB, userMB: initialUserMB }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [userMB, setUserMB] = useState({
    id: "",
    role: "",
    is_active: false,
    names: "",
    last_names: "",
    employee_number: "",
    user_id: null,
    extension_phone: "",
    branch_id: null,
    asset_id: null,
    admins_id: null,
    engineer_id: null,
  });
  const [branch, setBranch] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState(""); 
  const role = ["Responsable", "Gerente", "Ejectuvido", "Cajero", "Otro"];
  const [selectedAssets, setSelectedAssets] = useState([]);

  const me = store.me;

  const [loading, setLoading] = useState(false);

  
  const filteredAssets = useMemo(() => {
    const branchId = userMB.branch_id ? String(userMB.branch_id) : null;
    const assets = store.assets.filter(
      (asset) => String(asset.branch_id) === branchId
    );
    return assets.filter(
      (asset) => !selectedAssets.some((selected) => selected.id === asset.id)
    ); 
  }, [store.assets, userMB.branch_id, selectedAssets]);

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setUserMB({ ...userMB, branch_id: branchId });
    setBranch(store.branchs.find((branch) => branch.id === branchId));
  };

  const handleAddAsset = () => {
    console.log("Selected Asset ID:", selectedAssetId);
    console.log("Filtered Assets:", filteredAssets);

    const assetToAdd = filteredAssets.find(
      (asset) => asset.id === Number(selectedAssetId)
    );
    console.log("Asset to Add:", assetToAdd);

    if (
      assetToAdd &&
      !selectedAssets.some((selected) => selected.id === assetToAdd.id)
    ) {
      setSelectedAssets([...selectedAssets, assetToAdd]);
      setSelectedAssetId(""); 
    } else {
      console.log("El activo ya está en la lista o no se ha seleccionado uno.");
    }
  };

  const handleRemoveAsset = (assetId) => {
    setSelectedAssets(selectedAssets.filter((asset) => asset.id !== assetId));
  };

  const addId = () => {
    if (me.role === "Master") {
      setUserMB({ ...userMB, user_id: me.id });
    } else if (me.role === "Admin") {
      setUserMB({ ...userMB, admins_id: me.id });
    } else if (me.role === "Ingeniero de Campo") {
      setUserMB({ ...userMB, engineer_id: me.id });
    }
  };

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
        : "Espere mientras se crea el Usuario MB",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = id
        ? await actions.editUserMB(
            id,
            userMB.role,
            userMB.is_active,
            userMB.names,
            userMB.last_names,
            userMB.employee_number,
            userMB.extension_phone,
            userMB.branch_id,
            selectedAssets.map((asset) => asset.id), 
            userMB.user_id,
            userMB.admins_id,
            userMB.engineer_id
          )
        : await actions.add_userMB(
            userMB.role,
            userMB.is_active,
            userMB.names,
            userMB.last_names,
            userMB.employee_number,
            userMB.extension_phone,
            userMB.branch_id,
            selectedAssets.map((asset) => asset.id), 
            userMB.user_id,
            userMB.admins_id,
            userMB.engineer_id
          );

      Swal.fire({
        position: "center",
        icon: "success",
        title: id
          ? "Usuario MB Actualizado"
          : "Usuario MB creado correctamente",
        showConfirmButton: false,
        timer: 1500,
      });

      if (!id) {
        setUserMB({
          role: "",
          is_active: false,
          names: "",
          last_names: "",
          employee_number: "",
          extension_phone: "",
          branch_id: "",
          asset_id: "",
          user_id: null,
          admins_id: null,
          engineer_id: null,
        });
        setSelectedAssets([]); 
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

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getUsersMB();
    actions.getAssets();
    actions.getMe();
    addId();
    if (initialUserMB) {
      getBranchById(initialUserMB.branch_id);
      setUserMB({
        role: initialUserMB.role || "",
        is_active: initialUserMB.is_active || false,
        names: initialUserMB.names || "",
        last_names: initialUserMB.last_names || "",
        employee_number: initialUserMB.employee_number || "",
        extension_phone: initialUserMB.extension_phone || "",
        branch_id: initialUserMB.branch_id || "",
        asset_id: initialUserMB.asset_id || "",
        user_id: initialUserMB.user_id || null,
        admins_id: initialUserMB.admins_id || null,
        engineer_id: initialUserMB.engineer_id || null,
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Select
          label="Rol"
          placeholder={userMB.role}
          name="role"
          required
          value={userMB.role}
          onChange={handleChange}
        >
          {role.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </Select>
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
        <Input
          label="Numero de Telefono"
          name="extension_phone"
          value={userMB.extension_phone}
          onChange={handleChange}
          required
        />

        <Select
          label="Sucursal"
          placeholder={branch ? branch.branch_cr : ""}
          name="branch_id"
          required
          value={userMB.branch_id}
          onChange={handleBranchChange}
        >
          {store.branchs.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.branch_cr}
            </SelectItem>
          ))}
        </Select>

        <Select
          placeholder="Selecciona un activo"
          name="asset_id"
          value={selectedAssetId}
          onChange={(e) => {
            setSelectedAssetId(e.target.value);
          }}
        >
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.asset_type}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled>No hay activos disponibles</SelectItem>
          )}
        </Select>

        <Button type="button" onClick={handleAddAsset} color="primary" size="md" >
        <Plus />
        </Button>

        <ul className="list-disc pl-5">
          {selectedAssets.length > 0 ? (
            selectedAssets.map((asset) => (
              <li key={asset.id} className="flex justify-between items-center">
                <span>{asset.asset_type}</span>
                <Button color="danger" size="xs" variant="link">
                  <span
                    className="text-lg text-danger cursor-pointer"
                    onClick={() => handleRemoveAsset(asset.id)}
                  >
                    <DeleteIcon />
                  </span>
                </Button>
              </li>
            ))
          ) : (
            <li>No hay activos seleccionados.</li>
          )}
        </ul>

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
