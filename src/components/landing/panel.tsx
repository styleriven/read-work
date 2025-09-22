"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Panel() {
  const [panels] = useState([
    {
      id: 1,
      name: "User Info",
      link: "",
      img: "https://i.ibb.co/ZbgM4wJ/dai-luc-thu-nhan-giong-cai-tan-tat-la-vu-y-thien-tai.png",
    },
    {
      id: 2,
      name: "New",
      link: "",
      img: "https://i.ibb.co/PdB4jQq/moi-phien-ban-cua-toi-deu-chet-o-ben-canh-anh.png",
    },
    {
      id: 3,
      name: "huy",
      link: "",
      img: "https://i.ibb.co/4nfbsHDZ/bua-yeu-mat-xoai-duoi-chan-nui-cam.png",
    },
    {
      id: 4,
      name: "huy",
      link: "",
      img: "https://i.ibb.co/M528jY9d/canh-mai-trang-trong-tuyet.png",
    },
  ]);

  const [selectedPanel, setSelectedPanel] = useState(0);

  function NextPanel() {
    setSelectedPanel((prev) => (prev + 1) % panels.length);
  }

  function PrevPanel() {
    setSelectedPanel((prev) => (prev - 1 + panels.length) % panels.length);
  }

  return (
    <div className="md:w-1/2 w-full">
      <div className="relative group">
        <h2 className="text-center mb-2">{panels[selectedPanel].name}</h2>

        <div className="relative w-full h-72 overflow-hidden rounded-lg">
          <AnimatePresence mode="wait">
            <motion.img
              key={panels[selectedPanel].id}
              src={panels[selectedPanel].img}
              alt={panels[selectedPanel].name}
              className="absolute inset-0 w-full h-full object-contain"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </div>

        <button
          onClick={PrevPanel}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full 
              md:opacity-0 opacity-100 group-hover:opacity-100 transition-opacity duration-300"
        >
          ❮
        </button>

        <button
          onClick={NextPanel}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full 
                md:opacity-0 opacity-100 group-hover:opacity-100 transition-opacity duration-300"
        >
          ❯
        </button>
      </div>
    </div>
  );
}
