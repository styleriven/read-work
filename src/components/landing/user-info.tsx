"use client";
import {
  BellOutlined,
  BookOutlined,
  EyeOutlined,
  UndoOutlined,
  UserOutlined,
} from "@ant-design/icons";

export default function UserInfo() {
  return (
    <div className="md:w-1/4 w-full flex flex-col justify-center gap-2 items-center h-full">
      <div className=" rounded-2xl  p-6 ">
        <div className="text-center">
          <a
            href="comic/create"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg transform hover:scale-105"
          >
            Đăng truyện
          </a>
          <p className="text-black">Khu vực cho tác giả</p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="overflow-y-auto w-full">
        <ul className="flex justify-around gap-4">
          <li className="p-2">
            <div className="flex items-center justify-center w-10 h-10 bg-slate-700/30 rounded-xl relative hover:scale-[1.02]">
              <div
                className="absolute -top-2 -right-2 bg-[#f14668] text-white text-xs font-medium 
                  w-6 h-6 flex items-center justify-center rounded-full shadow-md z-10"
              >
                0
              </div>
              <EyeOutlined />
            </div>
            <div className="text-black text-xs mt-1 px-1">Đã Đọc</div>
          </li>
          <li className="p-2">
            <div className="flex items-center justify-center w-10 h-10 bg-slate-700/30 rounded-xl relative hover:scale-[1.02]">
              <div
                className="absolute -top-2 -right-2 bg-[#f14668] text-white text-xs font-medium 
                  w-6 h-6 flex items-center justify-center rounded-full shadow-md"
              >
                0
              </div>
              <BookOutlined />
            </div>
            <div className="text-black text-xs mt-1">Bookmark</div>
          </li>
          <li className="p-2">
            <div className="flex items-center justify-center w-10 h-10  bg-slate-700/30 rounded-xl relative hover:scale-[1.02]">
              <BellOutlined />
            </div>
            <div className=" text-black text-xs mt-1">Hệ Thống</div>
          </li>
          <li className="p-2">
            <div className="flex items-center justify-center w-10 h-10 bg-slate-700/30 rounded-xl relative hover:scale-[1.02]">
              <UserOutlined />
            </div>
            <div className="text-black text-xs mt-1">Tài Khoản</div>
          </li>
          <li className="p-2">
            <div className="flex items-center justify-center w-10 h-10 bg-slate-700/30 rounded-xl relative hover:scale-[1.02]">
              <UndoOutlined />
            </div>
            <div className="text-black text-xs mt-1 px-1">Hồi đáp</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
