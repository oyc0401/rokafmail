'use client'

import { Tabs, Tab, Chip } from "@nextui-org/react";
import { Mail, UnconnectedMail } from "./posts";
import { dateToStr } from "src/lib/time";
import { Card, DropDownCard } from "./card";
export function Content({ mails, unpostMails }) {

  console.log(mails);
  return (
    <>
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
          >
            {mails.map((post, index) => (
              <div key={post.id}>
                {index !== 0 && <div className="sized" style={{ height: 4 }}></div>}
                <DropDownCard
                  id={post.postId}
                  title={post.post.title}
                  name={post.post.name}
                  rel={post.post.relationship}
                  time={dateToStr(post.post.createdAt)}
                  username={post.user.username}
                />
              </div>
            ))}
          </Tab>
          <Tab
            key="music"
            title={
              <div className="flex items-center space-x-2">
                <span>전송 대기중</span>
              </div>
            }
          >
            {unpostMails.map((post, index) => (
              <div key={post.id}>
                {index !== 0 && <div className="sized" style={{ height: 4 }}></div>}
                <DropDownCard
                  id={post.postId}
                  title={post.post.title}
                  name={post.post.name}
                  rel={post.post.relationship}
                  time={dateToStr(post.post.createdAt)}
                  username={post.user.username}
                />
              </div>
            ))}
          </Tab>
        </Tabs>
      </div>
      {/* <main className="container mx-auto max-w-5xl flex-1 overflow-auto">
        <div className="flex h-full flex-col">
          {username}

        </div>
      </main> */}
    </>

  )
}


export function UnConnectedContent({ mails }) {

  return (
    <>
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
            panel:'py-0 px-0',
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
          >
            <div className="max-w-5xl mx-auto">
              {mails.map((post, index) => (
                <div key={post.id}>
                  {index !== 0 && <div className="sized" style={{ height: 4 }}></div>}
                  <DropDownCard
                    id={post.postId}
                    title={post.post.title}
                    name={post.post.name}
                    rel={post.post.relationship}
                    time={dateToStr(post.post.createdAt)}
                    username={post.user.username}
                  />
                </div>
              ))}
            </div>

          </Tab>
          <Tab
            key="music"
            title={
              <div className="flex items-center space-x-2">
                <span>전송 대기중</span>
              </div>
            }
          >
            {/* {unpostMails.map((post, index) => (
              <div key={post.id}>
                {index !== 0 && <div className="sized" style={{ height: 4 }}></div>}
                <DropDownCard
                  id={post.postId}
                  title={post.post.title}
                  name={post.post.name}
                  rel={post.post.relationship}
                  time={dateToStr(post.post.createdAt)}
                  username={post.user.username}
                />
              </div>
            ))} */}
          </Tab>
        </Tabs>
      </div>
      {/* <main className="container mx-auto max-w-5xl flex-1 overflow-auto">
        <div className="flex h-full flex-col">
          {username}

        </div>
      </main> */}
    </>

  )
}
