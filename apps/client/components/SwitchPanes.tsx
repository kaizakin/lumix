"use client";

import { Tabs, Tab } from "@heroui/react";
import { useState } from "react";

export function SwitchPanes() {
  const [selected, setSelected] = useState("");
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" color="primary" variant="solid" classNames={{
        tabList: "relative",
        cursor:
          "bg-primary/40 transition-all duration-300 rounded-md",
      }}
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(String(key))}
        defaultSelectedKey={"home"}
      >
        <Tab key="home" title="Home" />
        <Tab key="music" title="Canvas" />
        <Tab key="chat" title="Chat" />
        <Tab key="files" title="Files" />
        <Tab key="schedule" title="Schedule" />
      </Tabs>
    </div>
  );
}

