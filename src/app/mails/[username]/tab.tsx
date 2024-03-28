'use client'

import { Tabs, Tab, Chip } from "@nextui-org/react";

export function Tabss() {
  return (
    <div className="w-full">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          base: 'w-full max-w-5xl',
          tabList: "w-full gap-0",
          // cursor: "w-full bg-[#22d3ee]",
          // tab: "max-w-fit px-0 h-12",
          // tabContent: "group-data-[selected=true]:text-[#06b6d4]"
          cursor: '',
          tab: 'py-3',
          tabContent: 'text-base',
        }}
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <span>전송 완료</span>
            </div>
          }
        />
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <span>전송 대기중</span>
            </div>
          }
        />
      </Tabs>
    </div>
  )
}

