import { Image } from "antd";

export default function Avatar({
  preview,
  imageUrl,
  width,
  height,
  className,
  ...props
}: {
  imageUrl?: string;
  preview?: true;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <Image
      src={imageUrl}
      preview={
        preview ? { mask: <span className="text-white">Xem ảnh</span> } : false
      }
      width={width}
      height={height}
      className={`rounded-full overflow-hidden ${className}`}
      {...props}
    />
  );
}
