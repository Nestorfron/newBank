import { Tooltip, Badge, Button } from "@nextui-org/react";
import { NotificationIcon } from "../assets/icons/NotificationIcon.jsx";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.jsx";

export default function BellNotifications() {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const messages = store.messages;
  const jwt = localStorage.getItem("token");

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      navigate("/");
      return;
    } else {
      actions.getMessages();
    }
  }, []);

  return (
    <Badge content={!messages.length ? 0 : messages.length} color="primary">
      <Tooltip
        showArrow
        placement="right"
        content={!messages.length ? " " :
          <div className="px-1 py-2">
            <div className="text-small font-bold">Tienes</div>
            <div className="text-tiny">{messages.length} mensajes</div>
          </div>
        }
        classNames={{
          base: "foreground",
          content:"foreground",
          placement: "bottom",
        }}
      >
        <Button
          radius="full"
          isIconOnly
          aria-label="more than 99 notifications"
          variant="light"
          onClick={() => navigate("/messages")}
        >
          <NotificationIcon size={24} />
        </Button>
      </Tooltip>
    </Badge>
  );
}
