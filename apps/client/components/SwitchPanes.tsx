"use client";

import { useTabStore, Tabenum } from "@/store/useTabStore";
import React, { useEffect, useRef, useState } from "react";

export function SwitchPanes() {
  const selectedTab = useTabStore((s) => s.currentTab);
  const setSelectedTab = useTabStore((s) => s.setTab);
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = Object.values(Tabenum);

  useEffect(() => {
    const currentRef = tabRefs.current[tabs.indexOf(selectedTab)];
    if (currentRef) {
      const newStyle = {
        width: currentRef.offsetWidth + "px",
        left: currentRef.offsetLeft + "px"
      }

      if (sliderStyle.width != newStyle.width || sliderStyle.left != newStyle.left) {
        setSliderStyle(newStyle);
      }
    }
  }, [selectedTab, tabs, sliderStyle])

  return (
    <div className="flex w-full">
      <div className="relative bg-teal1 rounded-sm px-1">
        <span 
        className="absolute top-1 bottom-1 bg-white rounded-md transition-all ease-in-out duration-300 focus:outline-none"
        style={sliderStyle}></span>
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            ref={(element) => {
              tabRefs.current[idx] = element
            }}
            onClick={() => setSelectedTab(tab)}
            className={`relative cursor-pointer z-10 px-4 py-2 focus:outline-none font-semibold rounded-3xl transition-colors duration-200 ${selectedTab === tab ? "text-teal-500" : "text-white"}`}
          >
            {tab}
          </button>
        ))}
      </div>

    </div>
  );
}

