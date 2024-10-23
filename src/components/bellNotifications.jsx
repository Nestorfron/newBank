import {Badge, Button} from "@nextui-org/react";
import {NotificationIcon} from "../assets/icons/NotificationIcon.jsx";
import {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Context} from "../store/appContext.jsx";
import { m } from "framer-motion";

export default function BellNotifications() {
    const {store, actions} = useContext(Context);
    const navigate = useNavigate();

    const messages = store.messages;
    const jwt = localStorage.getItem("token");

   useEffect(() => {
    actions.getMessages();
  }, []);

  return (
    <Badge content={!messages.length ? 0 : messages.length} color="primary">
      <Button
        radius="full"
        isIconOnly
        aria-label="more than 99 notifications"
        variant="light"
        onClick={() => navigate("/messages")}
      >
        <NotificationIcon size={24} />
      </Button>
    </Badge>
  );
}