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
  Pagination,
  SortDescriptor,
  Chip,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "../VerticalDotsIcon";
import { useAsyncList } from "@react-stately/data";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { enQueue, forcePost } from "./server";
import { canSearch } from "src/lib/time";
// import { resend } from "./server";
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

export function DatabaseTable({ data }) {
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(data.length / rowsPerPage);

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const sortedItems = React.useMemo(() => {
    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column!];
      const second = b[sortDescriptor.column!];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, data]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems]);

  return (
    <Table
      aria-label="Example table with client side sorting"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      classNames={{
        wrapper: "min-h-[400px]",
      }}
      bottomContent={
        <div className="flex w-full justify-center h-10" style={{ height: 40 }}>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
          />
        </div>
      }
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
        <TableColumn key="title" allowsSorting>
          Title
        </TableColumn>
        {/* <TableColumn key="contents" allowsSorting>
          content
        </TableColumn> */}
        <TableColumn key="name" allowsSorting>
          Name
        </TableColumn>
        <TableColumn key="relationship" allowsSorting>
          Relationship
        </TableColumn>
        <TableColumn key="createdAt" allowsSorting>
          CreatedAt
        </TableColumn>
        <TableColumn key="status" allowsSorting>
          Status
        </TableColumn>
        <TableColumn key="postAt" allowsSorting>
          PostAt
        </TableColumn>
        <TableColumn key="action">Action</TableColumn>
      </TableHeader>
      <TableBody items={items} emptyContent={"No rows to display."}>
        {(item: {
          id: number;
          userId: number;
          posted: boolean;
          connect: boolean;
          generation: number;
          [key: string]: any;
        }) => (
          <TableRow key={item.id}>
            {(columnKey) => {
              switch (columnKey) {
                case "status":
                  if (item.posted) {
                    return (
                      <TableCell>
                        <Chip color="success">Posted</Chip>
                      </TableCell>
                    );
                  } else if (item.connect) {
                    return (
                      <TableCell>
                        <Chip color="warning">Wating</Chip>
                      </TableCell>
                    );
                  } else if (canSearch(item.generation)) {
                    return (
                      <TableCell>
                        <Chip color="danger">NoSearch</Chip>
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell>
                        <Chip color="primary">Verifying</Chip>
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
                          <DropdownMenu aria-label="Static Actions">
                            <DropdownSection title="Actions" showDivider>
                              <DropdownItem
                                onClick={async () => {
                                  if (await enQueue(item.id)) {
                                    alert("큐에 넣는것에 성공했습니다.");
                                  } else {
                                    alert("큐에 넣는것에 실패했습니다.");
                                  }
                                }}
                              >
                                enqueue
                              </DropdownItem>
                              <DropdownItem
                                onClick={async () => {
                                  if (
                                    confirm("편지를 강제로 보내시겠습니까?")
                                  ) {
                                    const response = await forcePost(item.id);
                                    alert(response);
                                  }
                                }}
                              >
                                forcedPost
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

  if (typeof value === "string") {
    if (value.length > 30) {
      return value.substring(0, 30) + "...";
    }
  }

  return value;
}
