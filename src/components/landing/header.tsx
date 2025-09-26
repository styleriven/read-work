"use client";
import Image from "next/image";
import { Dropdown, Spin } from "antd";
import {
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
import { useContext, createContext, useState, useEffect, use } from "react";
import { CategoryQuery } from "@/lib/server/queries/category-query";
import { FaChevronDown } from "react-icons/fa";

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

  const [menuItemTypes, setMenuItemTypes] = useState<any>([]);

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

  function handleClickType(menuItem: any) {
    console.log("Selected type: " + menuItem.name);
  }

  const itemTypes = menuItemTypes.map((item: any, i: number) => ({
    key: i,
    label: <button onClick={() => handleClickType(item)}>{item.name}</button>,
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

  async function getMenuItemTypes() {
    try {
      const data = await CategoryQuery.getAll();
      setMenuItemTypes(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    getMenuItemTypes();
  }, []);

  return (
    <div
      className={`${className} sticky top-0 z-50 mx-auto py-1 flex flex-col md:flex-row justify-between items-center w-full h-fit `}
      {...props}
    >
      <div className="flex gap-4 items-start sm:items-center sm:flex-row flex-col w-full mb-2 sm:mb-0">
        <div className="flex justify-between items-center w-full sm:w-auto">
          <Link href="/">
            <Image
              className="ml-2 cursor-pointer transition duration-300 hover:opacity-80 hover:scale-105"
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
            className={` ml-2 cursor-pointer items-center gap-2 justify-center text-white whitespace-nowrap sm:flex ${
              open ? "flex" : "hidden"
            }`}
          >
            <span>Danh sách</span>
            <FaChevronDown />
          </button>
        </Dropdown>
        <Dropdown menu={{ items: itemTypes }} trigger={["click"]}>
          <button
            className={`ml-2 cursor-pointer gap-2 text-white items-center justify-center whitespace-nowrap sm:flex ${
              open ? "flex" : "hidden"
            }`}
          >
            <span>Thể loại</span>
            <FaChevronDown />
          </button>
        </Dropdown>
      </div>
      <div
        className={`gap-4 items-start w-full md:w-auto sm:items-center sm:flex-row flex-col sm:flex mx-2 ${
          open ? "flex" : "hidden"
        }`}
      >
        <div className="flex flex-row items-center w-[90%] sm:w-auto gap-2 mx-2">
          <input
            className="flex-1 min-w-0 px-4 py-2 bg-white/5 text-white border border-white/20 rounded-xl 
        placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 
        focus:border-transparent transition-all duration-200"
            placeholder="Nhập tên truyện"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                route.push(`/search?q=${encodeURIComponent(search)}`);
              }
            }}
          />

          <Link
            href={`/search?q=${encodeURIComponent(search)}`}
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl 
        transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
          >
            Tìm kiếm
          </Link>
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
              className="mx-2"
            >
              <button className="flex items-center gap-2 justify-center cursor-pointer text-white whitespace-nowrap">
                <span>Xin chào, {user.userName || user.email}</span>
                <FaChevronDown />
              </button>
            </Dropdown>
          ) : (
            <>
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                className="bg-green-500 text-white text-center px-4 py-2 hover:bg-green-600 whitespace-nowrap duration-200 rounded-xl"
              >
                Đăng nhập
              </Link>
              <Link
                href={"/register"}
                className="bg-green-500 text-white px-4 mr-10 py-2 rounded-xl hover:bg-green-600 whitespace-nowrap duration-200 "
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
