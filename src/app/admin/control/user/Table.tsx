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
  Pagination,
  SortDescriptor,
  Chip,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "../VerticalDotsIcon";
import dayjs from "dayjs";
import { userDoubleCheck, resendUserMail, resendPostLast } from "./server";
import { useRouter } from "next/navigation";
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

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
  }, [sortDescriptor]);

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
        <TableColumn key="connect" allowsSorting>
          Connect
        </TableColumn>
        <TableColumn key="action">Action</TableColumn>
      </TableHeader>
      <TableBody items={items} emptyContent={"No rows to display."}>
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
