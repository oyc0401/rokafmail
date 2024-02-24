"use client";
import React, { useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
// import { resend } from "./server";
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

export function DatabaseTable({ data }) {
  const router = useRouter();

  return (
    <>
      <table className="w-full border-collapse mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">id</th>
            <th className="border px-4 py-2">UserId</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Relationship</th>
            <th className="border px-4 py-2">CreatedAt</th>
            <th className="border px-4 py-2">Posted</th>
            <th className="border px-4 py-2">PostAt</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const item = data[rowIndex];
            return (
              <tr>
                <td>{item.id}</td>
                <td>{item.userId}</td>
                <td>{item.title}</td>
                <td>{item.name}</td>
                <td>{item.relationship}</td>
                <td>{renderCellValue(item.createdAt)}</td>
                <td>{item.posted}</td>
                <td>{renderCellValue(item.postAt)}</td>
                <td>
                  
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <VerticalDotsIcon className="text-default-300" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownSection title="Navigations">
                        <DropdownItem
                          onClick={async () => {
                            router.push(
                              `/admin/control/post?userId=${item.userId}`,
                            );
                          }}
                        >
                          Search Posts
                        </DropdownItem>
                        <DropdownItem
                          onClick={async () => {
                            router.push(
                              `/admin/control/postQueue?userId=${item.userId}`,
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
