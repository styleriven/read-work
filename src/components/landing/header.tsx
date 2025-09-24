"use client";
import Image from "next/image";
import { Dropdown, Spin } from "antd";
import {
  DownOutlined,
  LoadingOutlined,
  LogoutOutlined,
  MenuOutlined,
  UnorderedListOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, createContext, useState } from "react";
import { div } from "framer-motion/dist/m";
export default function Header({
  className,
  ...props
}: {
  className?: string;
}) {
  const route = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

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
    label: <button onClick={() => handleClickList(item)}>{item.title}</button>,
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
    label: <button onClick={() => handleClickType(item)}>{item.title}</button>,
  }));

  const menuItemUser = [
    {
      title: "Trang cá nhân",
      icon: <UserOutlined />,
      href: "/dashboard/profile",
    },
    {
      title: "Đăng truyện",
      icon: <UploadOutlined />,
      href: "/comic/create",
    },
    {
      title: "Quản lý truyện",
      icon: <UnorderedListOutlined />,
      href: "/dashboard/my-comic",
    },
    {
      title: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: () => signOut(),
    },
  ];

  const userItems = menuItemUser.map((item, i) => ({
    key: i,
    label: item.href ? (
      <a href={item.href}>
        {item.icon} {item.title}
      </a>
    ) : (
      <button
        onClick={(e) => {
          e.preventDefault();
          item.onClick?.();
        }}
      >
        {item.icon} {item.title}
      </button>
    ),
  }));

  return (
    <div
      className={`${className} sticky top-0 z-50 mx-auto py-1 flex flex-col md:flex-row  justify-between  items-center w-full h-fit `}
      {...props}
    >
      <div className="flex ml-2 gap-4 items-start sm:items-center sm:flex-row flex-col w-full mb-2 sm:mb-0">
        <div className="flex justify-between items-center w-full sm:w-auto">
          <Link href="/">
            <Image
              className="cursor-pointer transition duration-300 hover:opacity-80 hover:scale-105"
              title="Trang chủ"
              src="/logo.jpg"
              alt="Logo"
              width={40}
              height={20}
            />
          </Link>
          <div className="flex sm:hidden mr-4">
            <MenuOutlined
              onClick={() => setOpen(!open)}
              className="text-white text-2xl cursor-pointer"
            />
          </div>
        </div>

        <Dropdown menu={{ items }} trigger={["click"]}>
          <button
            className={`cursor-pointer text-white whitespace-nowrap sm:flex ${
              open ? "flex" : "hidden"
            }`}
          >
            Danh sách
            <DownOutlined className="ml-2" />
          </button>
        </Dropdown>
        <Dropdown menu={{ items: itemTypes }} trigger={["click"]}>
          <button
            className={`cursor-pointer text-white whitespace-nowrap sm:flex ${
              open ? "flex" : "hidden"
            }`}
          >
            Thể loại
            <DownOutlined className="ml-2" />
          </button>
        </Dropdown>
      </div>
      <div
        className={`ml-2 gap-4 items-start sm:items-center sm:flex-row flex-col sm:flex w-full md:w-auto ${
          open ? "flex" : "hidden"
        }`}
      >
        <div className="flex flex-row">
          <input
            className="pl-5 pr-12 bg-white/5 text-white border rounded-xl placeholder-white/700 p-2
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 mr-4"
            placeholder="Nhập tên truyện"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                route.push(`/search?q=${encodeURIComponent(search)}`);
              }
            }}
          />

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
            onClick={() =>
              route.push(`/search?q=${encodeURIComponent(search)}`)
            }
          >
            Tìm kiếm
          </button>
        </div>

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
              className="px-4 py-2"
            >
              <button className="cursor-pointer text-white whitespace-nowrap">
                Xin chào, {user.userName || user.email}
                <DownOutlined className="ml-2" />
              </button>
            </Dropdown>
          ) : (
            <>
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                className="bg-green-500 text-white text-center px-4 py-2 rounded hover:bg-green-600 whitespace-nowrap"
              >
                Đăng nhập
              </Link>
              <Link
                href={"/register"}
                className="bg-green-500 text-white px-4 mr-10 py-2 rounded hover:bg-green-600 whitespace-nowrap"
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
