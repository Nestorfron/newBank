import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Input, Button, Spacer, ModalFooter } from "@nextui-org/react";
import Swal from "sweetalert2";

export const FormBranches = ({ id, btnBranch, branch: initialBranch }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [branch, setBranch] = useState({
    branch_cr: "",
    branch_address: "",
    branch_zone: "",
    branch_subzone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    console.log("Change detected:", e.target.name, e.target.value);
    setBranch({ ...branch, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Cargando...",
      text: id
        ? "Espere mientras se actualiza la sucursal"
        : "Espere mientras se crea la sucursal",
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
        ? await actions.editBranch(
            id,
            branch.branch_cr,
            branch.branch_address,
            branch.branch_zone,
            branch.branch_subzone
          )
        : await actions.add_branch(
            branch.branch_cr,
            branch.branch_address,
            branch.branch_zone,
            branch.branch_subzone
          );
      Swal.fire({
        position: "center",
        icon: "success",
        title: id ? "Sucursal Actualizada" : "Sucursal creada correctamente",
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
        setBranch({
          branch_cr: "",
          branch_address: "",
          branch_zone: "",
          branch_subzone: "",
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

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getBranchs();
    if (initialBranch) {
      setBranch({
        branch_cr: initialBranch.branch_cr || "",
        branch_address: initialBranch.branch_address || "",
        branch_zone: initialBranch.branch_zone || "",
        branch_subzone: initialBranch.branch_subzone || "",
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Input
          label="CR"
          name="branch_cr"
          value={branch.branch_cr}
          onChange={handleChange}
          required
        />
        <Input
          label="Dirección de la Sucursal"
          name="branch_address"
          value={branch.branch_address}
          onChange={handleChange}
          required
        />
        <Input
          label="Zona"
          name="branch_zone"
          value={branch.branch_zone}
          onChange={handleChange}
          required
        />
        <Input
          label="Subzona"
          name="branch_subzone"
          value={branch.branch_subzone}
          onChange={handleChange}
          required
        />
      </div>
      <Spacer />
      <ModalFooter>
        <Button type="submit" color="primary" disabled={loading}>
          {btnBranch}
        </Button>
      </ModalFooter>
    </form>
  );
};
