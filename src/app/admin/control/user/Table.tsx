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
        <TableColumn key="username" allowsSorting>
          Username
        </TableColumn>
        <TableColumn key="name" allowsSorting>
          Name
        </TableColumn>
        <TableColumn key="birth" allowsSorting>
          Birth
        </TableColumn>
        <TableColumn key="generation" allowsSorting>
          Generation
        </TableColumn>
        {/* <TableColumn key="sodae" allowsSorting>
          sodae
        </TableColumn>
        <TableColumn key="memberSeq" allowsSorting>
          memberSeq
        </TableColumn> */}
        <TableColumn key="connect" allowsSorting>
          Connect
        </TableColumn>
        <TableColumn key="action">Action</TableColumn>
      </TableHeader>
      <TableBody items={list.items} emptyContent={"No rows to display."}>
        {(item: { id: number; connect: boolean; [key: string]: any }) => (
          <TableRow key={item.id}>
            {(columnKey) => {
              switch (columnKey) {
                case "connect":
                  if (item.connect) {
                    return (
                      <TableCell>
                        <Chip color="success">Connected</Chip>
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

                          <DropdownMenu
                            disabledKeys={
                              item.connect
                                ? ["verify"]
                                : ["sendAll", "sendFront"]
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
