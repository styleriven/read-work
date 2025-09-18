"use client";
import {
  ArrowRightOutlined,
  CommentOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export default function New() {
  const [notifications] = useState([
    {
      id: 1,
      date: "29/08",
      title: "Hệ thống đánh giá mới",
      count: 8,
      isActive: true,
    },
    {
      id: 2,
      date: "23/05",
      title: "Giao diện & Cơ chế mới",
      count: 121,
      isActive: true,
    },
    {
      id: 3,
      date: "10/12",
      title: "Event - Cơ chế mới",
      count: 118,
      isActive: true,
    },
    {
      id: 4,
      date: "29/08",
      title: "Tính Năng Mới DLCC",
      count: 190,
      isActive: true,
    },
  ]);

  return (
    <div className="w-1/4  ml-10">
      <div className="flex justify-between p-3">
        <div className="flex items-center">
          <NotificationOutlined />
          <span className="ml-2 text-sm font-medium">Thông báo</span>
        </div>

        <div className="flex items-center" title="Xem thêm">
          <span>Thêm</span>
          <ArrowRightOutlined className="ml-2 text-lg" />
        </div>
      </div>

      <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className="group relative">
            <div className="flex items-center p-3 rounded-xl hover:bg-slate-700/30 transition-all duration-200 cursor-pointer">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
              <div className="text-xs text-white bg-slate-700/30 rounded-full min-w-[2.5rem] mr-3">
                {notification.date}
              </div>
              <div className="flex-1 ">
                <div className=" text-sm font-medium truncate">
                  {notification.title}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <span className="text-xs">{notification.count}</span>
                <CommentOutlined />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
