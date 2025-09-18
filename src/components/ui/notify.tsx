import { notification } from "antd";
import "@ant-design/v5-patch-for-react-19";

type NotificationType = "success" | "info" | "warning" | "error";
type PlacementType = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

interface NotifyOptions {
  title: string;
  description?: string;
  type?: NotificationType;
  placement?: PlacementType;
}

export const notify = ({
  title,
  description,
  type = "info",
  placement = "bottomLeft",
}: NotifyOptions) => {
  notification[type]({
    message: title,
    description,
    placement,
  });
};
