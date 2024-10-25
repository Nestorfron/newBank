import React, {
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { Context } from "../store/appContext";
import { Users } from "../components/users.jsx";
import { Admins } from "../components/admins.jsx";
import { Engineers } from "../components/engineer.jsx";
import { useNavigate } from "react-router-dom";

import useTokenExpiration from "../hooks/useTokenExpitarion.jsx";

export const AllUsers = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useTokenExpiration();

  const user = store.me;

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }
    if (user.role === "Ingeniero de Campo") {
        navigate("/dashboard");
        return;
    }
    actions.getMe();
    actions.getEngineers();
    actions.getAdmins();
    actions.getUsers();
  }, []);

  return (
    <div className="m-5">
      {user.role === "Master" ? <Users /> : null}
      {user.role === "Admin" || user.role === "Master" ? <Admins /> : null}
      {user.role === "Admin" || user.role === "Master" ? <Engineers /> : null}
    </div>
  );
};
