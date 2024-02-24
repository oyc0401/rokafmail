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
import { resend } from "./server";
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

export function DatabaseTable({ data }) {
  let list = useAsyncList({
    async load({ signal }) {
      return {
        items: data,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  return (
    <Table
      aria-label="Example table with client side sorting"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      classNames={{
        table: "min-h-[400px]",
      }}
    >
      <TableHeader>
        
        <TableColumn key="id" allowsSorting>
          Id
        </TableColumn>
        <TableColumn key="userId" allowsSorting>
          UserId
        </TableColumn>
        <TableColumn key="username" allowsSorting>
          Username
        </TableColumn>
        <TableColumn key="postId" allowsSorting>
          PostId
        </TableColumn>
        
        <TableColumn key="title" allowsSorting>
          Title
        </TableColumn>
        <TableColumn key="name" allowsSorting>
          Name
        </TableColumn>
        <TableColumn key="relationship" allowsSorting>
          Relationship
        </TableColumn>
        <TableColumn key="createdAt" allowsSorting>
          CreatedAt
        </TableColumn>
        <TableColumn key="action">Action</TableColumn>
      </TableHeader>
      <TableBody items={list.items} emptyContent={"No rows to display."}>
        {(item: {
          id: number;
          postId: number;
          posted: boolean;
          [key: string]: any;
        }) => (
          <TableRow key={item.id}>
            {(columnKey) => {
              switch (columnKey) {
                case "posted":
                  if (item.posted) {
                    return (
                      <TableCell>
                        <Chip color="success">Posted</Chip>
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell>
                        <Chip color="danger">Wating</Chip>
                      </TableCell>
                    );
                  }
                case "action":
                  return (
                    <TableCell>
                      <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
                              <VerticalDotsIcon className="text-default-300" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownSection title="Actions">
                              <DropdownItem
                                onClick={async () => {
                                  const result = await resend(item.postId);
                                  alert(result);
                                }}
                              >
                                Send
                              </DropdownItem>
                            </DropdownSection>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </TableCell>
                  );
                default:
                  return (
                    <TableCell>
                      {renderCellValue(getKeyValue(item, columnKey))}
                    </TableCell>
                  );
              }
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
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
