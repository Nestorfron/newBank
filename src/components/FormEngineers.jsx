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

export const FormEngineers = ({ id, btnEngineer, engineer: initialEngineer }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [engineer, setEngineer] = useState({
    user_name: "",
    password: "",
    names: "",
    last_names: "",
    employee_number: "",
    subzone: "",
    provider_id: null,
    is_active: "",
    role: "",
    user_id: null,
    admin_id: null,
  });
  const [provider, setProvider] = useState("");

  const role = ["Imgeniero de Campo"]

  const [loading, setLoading] = useState(false);

  const me = store.me;

  const addId = ()  => {
    if (me.role === "Master") {
      setEngineer({ ...engineer, user_id: me.id });
    } else if (me.role === "Admin") {
      setEngineer({ ...engineer, admin_id: me.id });
    }
  }

  const handleChange = (e) => {
    setEngineer({ ...engineer, [e.target.name]: e.target.value });
    console.log(engineer);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Cargando...",
      text: id
        ? "Espere mientras se actualiza el Engineer"
        : "Espere mientras se crea el Engineer",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      console.log(engineer);
      const response = id
        ? await actions.editEngineer(
            id,
            engineer.user_name,
            engineer.password,
            engineer.names,
            engineer.last_names,
            engineer.employee_number,
            engineer.subzone,
            engineer.provider_id,
            engineer.is_active,
            engineer.role,
            engineer.user_id,
            engineer.admin_id
          )
        : await actions.create_engineer(
            engineer.user_name,
            engineer.password,
            engineer.names,
            engineer.last_names,
            engineer.employee_number,
            engineer.subzone,
            engineer.provider_id,
            engineer.is_active,
            engineer.role,
            engineer.user_id,
            engineer.admin_id
          );
      Swal.fire({
        position: "center",
        icon: "success",
        title: id ? "Engineer Actualizado" : "Engineer creado correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
      if (!id) {
        setEngineer({
          user_name: "",
          password: "",
          names: "",
          last_names: "",
          employee_number: "",
          subzone: "",
          provider_id: null,
          is_active: "",
          role: "",
          user_id: null,
          admin_id: null,
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

  useEffect(() => {
    // const jwt = localStorage.getItem("token");
    // if (!jwt) {
    //   navigate("/");
    //   return;
    // }
    actions.getEngineers();
    actions.getProviders();
    actions.getMe();
    addId();
    if (initialEngineer) {
      getProviderById(initialEngineer.provider_id);
      setEngineer({
        user_name: initialEngineer.user_name || "",
        names: initialEngineer.names || "",
        last_names: initialEngineer.last_names || "",
        employee_number: initialEngineer.employee_number || "",
        subzone: initialEngineer.subzone || "",
        provider_id: initialEngineer.provider_id || null,
        is_active: initialEngineer.is_active || false,
        role: initialEngineer.role || "",
        user_id: initialEngineer.user_id || null,
        admin_id: initialEngineer.admin_id || null,
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Input
          label="Nombre de Usuario"
          name="user_name"
          value={engineer.user_name}
          onChange={handleChange}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={engineer.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Nombres"
          name="names"
          value={engineer.names}
          onChange={handleChange}
          required
        />
        <Input
          label="Apellidos"
          name="last_names"
          value={engineer.last_names}
          onChange={handleChange}
          required
        />
        <Input
          label="Número de Empleado"
          name="employee_number"
          value={engineer.employee_number}
          onChange={handleChange}
          required
        />
        <Input
          label="Subzona"
          name="subzone"
          value={engineer.subzone}
          onChange={handleChange}
          required
        />
        <Select
          label="Proveedor"
          placeholder={provider ? provider.company_name : ""}
          name="provider_id"
          required
          value={engineer.provider_id}
          onChange={handleChange}
        >
          {store.providers.map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              {provider.company_name}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Rol"
          placeholder={engineer.role}
          name="role"
          required
          value={engineer.role}
          onChange={handleChange}
        >
          {role.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </Select>
        <div className="flex items-center">
          <Switch
            name="is_active"
            isSelected={engineer.is_active}
            onChange={(e) => setEngineer({ ...engineer, is_active: e.target.checked })}
          />
          <label className="ml-2">Activo</label>
        </div>
      </div>
      <Spacer />
      <ModalFooter>
        <Button type="submit" color="primary" disabled={loading}>
          {btnEngineer}
        </Button>
      </ModalFooter>
    </form>
  );
};