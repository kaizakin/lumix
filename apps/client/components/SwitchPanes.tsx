"use client";

import { useTabStore, Tabenum } from "@/store/useTabStore";
import { Tabs, Tab } from "@heroui/react";

export function SwitchPanes() {
  const selectedTab = useTabStore((s) => s.currentTab);
  const setSelectedTab = useTabStore((s) => s.setTab);
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" color="primary" variant="solid" classNames={{
        tabList: "relative",
        cursor:
          "bg-primary/40 transition-all duration-300 rounded-md",
      }}
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as Tabenum)}
        defaultSelectedKey={"home"}
      >
        <Tab key={Tabenum.Home} title="Home" />
        <Tab key={Tabenum.Canvas} title="Canvas" />
        <Tab key={Tabenum.Chat} title="Chat" />
        <Tab key={Tabenum.Files} title="Files" />
        <Tab key={Tabenum.Schedule} title="Schedule" />
      </Tabs>
    </div>
  );
}

