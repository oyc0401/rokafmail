"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Chip,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "../VerticalDotsIcon";
import { useAsyncList } from "@react-stately/data";
import dayjs from "dayjs";
import { userDoubleCheck, resendUserMail, resendPostLast } from "./server";
import { useRouter } from "next/navigation";
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

export function DatabaseTable({ data }) {
  const router = useRouter();

  const dummy = [
    {
      id: 33,
      username: "Mr곽",
      name: "곽희근",
      birth: "19950824",
      generation: 852,
      message: "미안",
      memberSeq: null,
      sodae: null,
      connect: false,
    },
    {
      id: 34,
      username: "rhkrgmlrms",
      name: "곽희근",
      birth: "19950824",
      generation: 852,
      message: "곽희근",
      memberSeq: "347938631",
      sodae: "3117",
      connect: true,
    },
    {
      id: 36,
      username: "212",
      name: "45",
      birth: "45454545",
      generation: 864,
      message: "1212",
      memberSeq: null,
      sodae: null,
      connect: false,
    },
  ];

  console.log(data);

  return (
    <>
      <table className="w-full border-collapse mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">id</th>
            <th className="border px-4 py-2">username</th>
            <th className="border px-4 py-2">name</th>
            <th className="border px-4 py-2">birth</th>
            <th className="border px-4 py-2">generation</th>
            <th className="border px-4 py-2">message</th>
            <th className="border px-4 py-2">memberSeq</th>
            <th className="border px-4 py-2">sodae</th>
            <th className="border px-4 py-2">connect</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const item = data[rowIndex];
            return (
              <tr>
                <td>{item.id}</td>
                <td>{item.username}</td>
                <td>{item.name}</td>
                <td>{item.birth}</td>
                <td>{item.generation}</td>
                <td>{item.message}</td>
                <td>{item.memberSeq}</td>
                <td>{item.sodae}</td>
                <td>{renderCellValue(item.connect)}</td>
                <td>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <VerticalDotsIcon className="text-default-300" />
                      </Button>
                    </DropdownTrigger>

                    <DropdownMenu
                      disabledKeys={
                        item.connect ? ["verify"] : ["sendAll", "sendFront"]
                      }
                    >
                      <DropdownSection title="Actions" showDivider>
                        <DropdownItem
                          key="verify"
                          onClick={async () => {
                            const result = await userDoubleCheck(item.id);
                            alert(result);
                          }}
                        >
                          Verify
                        </DropdownItem>
                        <DropdownItem
                          key="sendAll"
                          onClick={async () => {
                            const result = await resendUserMail(item.id);
                            alert(result);
                          }}
                        >
                          Post All
                        </DropdownItem>
                        <DropdownItem
                          key="sendFront"
                          onClick={async () => {
                            const result = await resendPostLast(item.id);
                            alert(result);
                          }}
                        >
                          Post Front
                        </DropdownItem>
                      </DropdownSection>

                      <DropdownSection title="Navigations">
                        <DropdownItem
                          onClick={async () => {
                            router.push(
                              `/admin/control/post?userId=${item.id}`,
                            );
                          }}
                        >
                          Search Posts
                        </DropdownItem>
                        <DropdownItem
                          onClick={async () => {
                            router.push(
                              `/admin/control/postQueue?userId=${item.id}`,
                            );
                          }}
                        >
                          Search PostQueues
                        </DropdownItem>
                      </DropdownSection>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function renderCellValue(value: any) {
  if (typeof value === "boolean") {
    return value ? "T" : "F";
  }

  //console.log(value);
  if (value instanceof Date) {
    return dayjs.tz(value, "Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  }

  return value;
}
