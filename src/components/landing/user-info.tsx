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
    <div className="w-1/4 mr-10 ">
      <div className=" rounded-2xl  p-6 ">
        <div className="text-center">
          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg transform hover:scale-105">
            Đăng truyện
          </button>
          <p className="">Khu vực cho tác giả</p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="p-3">
        <ul className="flex justify-between gap-4">
          <li>
            <div className="p-3 bg-slate-700/30 rounded-xl relative hover:scale-[1.02]">
              <div
                className="absolute -top-2 -right-2 bg-[#f14668] text-white text-xs font-medium 
                  w-6 h-6 flex items-center justify-center rounded-full shadow-md"
              >
                0
              </div>
              <EyeOutlined />
            </div>
            <div className="text-xs mt-1 px-1">Đã Đọc</div>
          </li>
          <li>
            <div className="p-3 bg-slate-700/30 rounded-xl relative hover:scale-[1.02]">
              <div
                className="absolute -top-2 -right-2 bg-[#f14668] text-white text-xs font-medium 
                  w-6 h-6 flex items-center justify-center rounded-full shadow-md"
              >
                0
              </div>
              <BookOutlined />
            </div>
            <div className="text-xs mt-1">Bookmark</div>
          </li>
          <li>
            <div className="p-3 bg-slate-700/30 rounded-xl relative hover:scale-[1.02]">
              <BellOutlined />
            </div>
            <div className="text-xs mt-1">Hệ Thống</div>
          </li>
          <li>
            <div className="p-3 bg-slate-700/30 rounded-xl relative hover:scale-[1.02]">
              <UserOutlined />
            </div>
            <div className="text-xs mt-1">Tài Khoản</div>
          </li>
          <li>
            <div className="p-3 bg-slate-700/30 rounded-xl relative hover:scale-[1.02]">
              <UndoOutlined />
            </div>
            <div className="text-xs mt-1 px-1">Hồi đáp</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
