
import react, { useEffect, useRef } from "react";
import { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const useTokenExpiration = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const inactivityTimeoutRef = useRef(null);

  const startInactivityTimer = () => {
    inactivityTimeoutRef.current = setTimeout(() => {
      expireSession();
    }, 900000);
  };

  const resetInactivityTimer = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    startInactivityTimer();
  };

  const expireSession = () => {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      localStorage.removeItem("token");
      Swal.fire({
        icon: "warning",
        title: "Sesión expirada",
        text: "Tu sesión ha expirado por inactividad. Por favor, vuelve a iniciar sesión.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        navigate("/");
      });
    }
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    }

    try {
      const decodedToken = jwtDecode(jwt);
      const currentTime = Date.now() / 1000;

      if (currentTime > decodedToken.exp) {
        expireSession();
        return;
      }
    } catch (error) {
      console.error("Token no válido", error);
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("click", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    startInactivityTimer();

    return () => {
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("click", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [navigate]);

  return null;
};

export default useTokenExpiration;
