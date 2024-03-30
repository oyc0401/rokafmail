'use client'

import { Tabs, Tab, Chip } from "@nextui-org/react";
import { Mail, UnconnectedMail } from "./posts";
import { dateToStr } from "src/lib/time";
import { PostCard } from "./card";
export function Content({ mails, unpostMails }) {
  return (
    <>
      <div role='mails' className="w-full">
        <Tabs
          aria-label="Options"
          color="primary"
          variant="underlined"
          classNames={{
            base: 'w-full max-w-3xl',
            tabList: "w-full gap-0",
            // cursor: "w-full bg-[#22d3ee]",
            // tab: "max-w-fit px-0 h-12",
            // tabContent: "group-data-[selected=true]:text-[#06b6d4]"
            cursor: '',
            tab: 'py-5 h-12',
            tabContent: 'text-base',
            panel: 'p-0'
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
            <div className="max-w-3xl mx-auto">
              <div className="bg-[#F3F3F3] w-full p-6">{""}</div>
              {mails.map((post, index) => (
                <div key={post.id}>
                  {index !== 0 && <div className="sized" style={{ height: 4 }}></div>}
                  <PostCard
                    id={post.id}
                    title={post.title}
                    name={post.name}
                    rel={post.relationship}
                    time={dateToStr(post.createdAt)}
                    username={post.user.username}
                    contents={"내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ "}
                    secret={false}
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
            <div className="max-w-3xl mx-auto">
              <div className="bg-[#F3F3F3] w-full p-6">{""}</div>
              {unpostMails.map((post, index) => (
                <div key={post.id}>
                  {index !== 0 && <div className="sized" style={{ height: 4 }}></div>}
                  <PostCard
                    id={post.postId}
                    title={post.post.title}
                    name={post.post.name}
                    rel={post.post.relationship}
                    time={dateToStr(post.post.createdAt)}
                    username={post.user.username}
                    contents={"내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ "}
                    secret={true}
                  />
                </div>
              ))}
            </div>

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
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#F3F3F3] w-full p-6">{""}</div>
        {mails.map((post, index) => (
          <div key={post.id}>
            {index !== 0 && <div className="sized" style={{ height: 4 }}></div>}
            <PostCard
              id={post.postId}
              title={post.post.title}
              name={post.post.name}
              rel={post.post.relationship}
              time={dateToStr(post.post.createdAt)}
              username={post.user.username}
              contents={"내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ 내용내용ㅎㅎ "}
              secret={true}
            />
          </div>
        ))}
      </div>
    </>

  )
}
