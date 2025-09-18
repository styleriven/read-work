import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Loading({
  className,
  classNameIcon,
  styleIcon,
  ...props
}: {
  className?: string;
  classNameIcon?: string;
  styleIcon?: React.CSSProperties;
}) {
  return (
    <Spin
      className={`px-4 py-2 ${className}`}
      {...props}
      indicator={
        <LoadingOutlined className={classNameIcon} spin style={styleIcon} />
      }
    />
  );
}
