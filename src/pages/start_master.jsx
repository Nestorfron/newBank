import  React, { useContext, useState, useMemo, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Button, Input, Tabs, Tab, Card, CardBody, Select, SelectItem, Switch } from "@nextui-org/react";
import img from "../assets/drapp_logo.png";





export const Start_master = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [selected, setSelected] = useState("login");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({
    user_name: "",
    password: "",
    names: "",
    last_names: "",
    employee_number: "",
    subzone: "",
    role: "",
    is_active: false,
    
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(user);
  };

  const role = ["Master"]

  

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    setError("");
    const success = await actions.start_master(
      user.user_name,
      user.password,
      user.names,
      user.last_names,
      user.employee_number,
      user.subzone,
      user.role,
      user.is_active
      
    );

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Error al crear el usuario");
    }
  };

  useEffect(() => {
    if (store.users.length > 0) {
      navigate("/");
    }
  }, []);
  


  return (
    <>
      <div className="flex-col w-full mt-10">
        <Card className="m-auto min-w-[280px] max-w-[320px] h-[auto]">
          <div className="img-container m-auto pb-5">
            <img src={img} alt="DR-App" height={200} width={200} />
          </div>
          <CardBody className="overflow-hidden">
            <Tabs
              fullWidth
              size="md"
              aria-label="Tabs form"
              selectedKey={selected}
              onSelectionChange={setSelected}
            >
              <Tab key="login" title="Super User">
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmitSignUp}
                >
                  <Input 
                    isRequired 
                    label="Nombre de Usuario"
                    name="user_name"
                    value={user.user_name}
                    placeholder="" 
                    type="text" 
                    onChange={handleChange}
                    required
                  />
                  <Input 
                    isRequired 
                    label="Contraseña" 
                    name="password"
                    value={user.password}
                    placeholder="" 
                    type="password" 
                    onChange={handleChange}
                    required
                    />
                  <Input
                    isRequired
                    label="Nombres"
                    name="names"
                    value={user.names}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    isRequired
                    label="Apellidos"
                    name="last_names"
                    value={user.last_names}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    isRequired
                    label="Número de Empleado"
                    name="employee_number"
                    value={user.employee_number}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    isRequired
                    label="Subzona"
                    name="subzone"
                    value={user.subzone}
                    onChange={handleChange}
                    required
                  />
                  <Select
                    label="Rol"
                    placeholder={user.role}
                    name="role"
                    required
                    value={user.role}
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
                      isSelected={user.is_active}
                      onChange={(e) => setUser({ ...user, is_active: e.target.checked })}
                    />
                    <label className="ml-2">Activo</label>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button fullWidth color="primary" type="submit">
                      Enviar
                    </Button>
                  </div>
                </form>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </>
    );
};