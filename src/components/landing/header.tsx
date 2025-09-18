"use client";
import Image from "next/image";
import { Dropdown, Spin } from "antd";
import {
  DownOutlined,
  LoadingOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, createContext } from "react";

export default function Header({
  className,
  ...props
}: {
  className?: string;
}) {
  const route = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const menuItems = [
    {
      title: "Tìm kiếm năng cao",
    },
    {
      title: "bảng xếp hạnh",
    },
    {
      title: "Truyện sáng tác",
    },
    {
      title: "Truyện dịch/Edit",
    },
  ];

  function handleClickList(menuItem: any) {
    console.log("huy " + menuItem.title);
  }

  const items = menuItems.map((item, i) => ({
    key: i,
    label: <a onClick={() => handleClickList(item)}>{item.title}</a>,
  }));

  const menuItemTypes = [
    {
      title: "Thể loại 1",
    },
    {
      title: "Thể loại 2",
    },
    {
      title: "Thể loại 3",
    },
  ];

  function handleClickType(menuItem: any) {
    console.log("Selected type: " + menuItem.title);
  }

  const itemTypes = menuItemTypes.map((item, i) => ({
    key: i,
    label: <a onClick={() => handleClickType(item)}>{item.title}</a>,
  }));

  const menuItemUser = [
    {
      title: "Trang cá nhân",
      icon: <UserOutlined />,
      onClick: () => {
        route.push("/dashboard/profile");
      },
    },
    {
      title: "Đăng truyện",
      icon: <UploadOutlined />,
      onClick: () => {
        route.push("/comic/create");
      },
    },
    {
      title: "Quản lý truyện",
      icon: <UnorderedListOutlined />,
      onClick: () => {
        route.push("/dashboard/my-comic");
      },
    },
    {
      title: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: () => signOut(),
    },
  ];

  const userItems = menuItemUser.map((item, i) => ({
    key: i,
    label: (
      <a onClick={item.onClick}>
        {item.icon} {item.title}
      </a>
    ),
  }));
  return (
    <div
      className={`${className} sticky top-0 z-50 mx-auto py-1 flex justify-between items-center w-full h-fit md:justify-between`}
      {...props}
    >
      <div className="flex gap-4 items-center">
        <Link href="/" className="inline-block">
          <Image
            className="cursor-pointer transition duration-300 hover:opacity-80 hover:scale-105"
            title="Trang chủ"
            src="/logo.jpg"
            alt="Logo"
            width={40}
            height={20}
          />
        </Link>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a className="cursor-pointer text-white">
            Danh sách
            <DownOutlined className="ml-2" />
          </a>
        </Dropdown>
        <Dropdown menu={{ items: itemTypes }} trigger={["click"]}>
          <a className="cursor-pointer text-white">
            Thể loại
            <DownOutlined className="ml-2" />
          </a>
        </Dropdown>
      </div>
      <div className="flex gap-4 items-center">
        <input
          className="pl-5 pr-12 bg-white/5 text-white border rounded-xl placeholder-white/700 p-2
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          placeholder="Nhập tên truyện"
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Tìm kiếm
        </button>
        {status === "loading" && (
          <Spin
            className="px-4 py-2"
            indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />}
          />
        )}
        {status !== "loading" &&
          (user ? (
            <Dropdown
              menu={{ items: userItems }}
              trigger={["click"]}
              className=" px-4 py-2"
            >
              <a className="cursor-pointer text-white">
                Xin chào, {user.userName || user.email}
                <DownOutlined className="ml-2" />
              </a>
            </Dropdown>
          ) : (
            <>
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                className="bg-green-500 text-white text-center px-4 py-2 rounded hover:bg-green-600"
              >
                Đăng nhập
              </Link>
              <Link
                href={"/register"}
                className="bg-green-500 text-white px-4 mr-10 py-2 rounded hover:bg-green-600"
              >
                Đăng ký
              </Link>
            </>
          ))}
      </div>
    </div>
  );
}

export const UserContext = createContext<any>(null);

export const useUser = () => useContext(UserContext);
