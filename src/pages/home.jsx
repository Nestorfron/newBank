import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.jsx";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";
import img from "../assets/drapp_logo.png";
import { useTheme } from "next-themes";
import "../styles/index.css";

export const Home = () => {
  const { store, actions } = useContext(Context);
  const { setTheme } = useTheme();
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
    is_active: "",
    role: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const users = store.users;


  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setError("");

    const success = await actions.login(userName, password);

    if (success) {
      const user = await actions.getMe();
      if (user.role === "Ingeniero de Campo") {
        navigate("/engenieerDashboard");}
      else {
        navigate("/dashboard");
      }
    } else {
      setError("Nombre de usuario o contraseña incorrectos");
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(user);
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    setError("");
    const success = await actions.register(
      user.user_name,
      user.password,
      user.names,
      user.last_names,
      user.employee_number,
      user.subzone,
      user.is_active,
      user.role
    );

    if (success) {
      navigate("/");
    } else {
      setError("Error al crear el usuario");
    }
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    actions.getMe();
    actions.getUsers();
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
              <Tab key="login" title="Iniciar Sesión">
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmitLogin}
                >
                  <Input
                    isRequired
                    label="Nombre de Usuario"
                    placeholder=""
                    type="text"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <Input
                    isRequired
                    label="Constraseña"
                    placeholder=""
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
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
