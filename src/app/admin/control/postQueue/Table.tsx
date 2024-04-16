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
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
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
  }, [sortDescriptor,data]);

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
      <TableBody items={items} emptyContent={"No rows to display."}>
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
