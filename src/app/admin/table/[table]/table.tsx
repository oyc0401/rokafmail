"use client";
import dayjs from "dayjs";
import Link from "next/link";
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

// import {
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownSection,
//   DropdownItem,Button
// } from "@nextui-org/react";

// import { deleteObj } from "./server";
dayjs.extend(utc);
dayjs.extend(timezone);

// const TableName = ["user", "user_queue", "post", "post_queue", "unc_post"];

export function Table({ data, tableName }) {
  // console.log(data);

  if (data.length == 0) {
    return (
      <>
        <Header tableName={tableName}></Header>
        요소가 없습니다.
      </>
    );
  }
  const columns = Object.keys(data[0]);
  // console.log(columns);

  async function clickEvent(row) {
    if (confirm(`정말로 삭제하시겠습니까? ${tableName}, ${row["id"]}`)) {
      //await deleteObj(tableName, row["id"]);

    }

    // if (tableName == "post") {
    //   console.log("이거");

    // }
    // console.log(row);
  }

  return (
    <>
      <Header tableName={tableName}></Header>
      <table className="w-full border-collapse mt-4">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((column) => (
              <th key={column} className="border px-4 py-2">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              columns={columns}
              row={row}
              event={clickEvent}
            ></TableRow>
          ))}
        </tbody>
      </table>
    </>
  );
}

const width = [60, 100, 700, 60, 70, 80]

function TableRow({ columns, row, event }) {
  // return (<Dropdown>
  //   <DropdownTrigger>
  //     <div>{columns.map((column, colIndex) => (
  //       <td key={colIndex} style={{width:width[colIndex]}} className="border px-4 py-2">
  //         {renderCellValue(row[column])}
  //       </td>
  //     ))}</div>

  //   </DropdownTrigger>
  //   <DropdownMenu aria-label="Static Actions">
  //     <DropdownItem key="new">New file</DropdownItem>
  //     <DropdownItem key="copy">Copy link</DropdownItem>
  //     <DropdownItem key="edit">Edit file</DropdownItem>
  //     <DropdownItem key="delete" className="text-danger" color="danger">
  //       Delete file
  //     </DropdownItem>
  //   </DropdownMenu>
  // </Dropdown>);
  return (
    <tr
      onContextMenu={(e) => {
        e.preventDefault();
        console.log("클릭!");
        event(row);
      }}
    >
      {columns.map((column, colIndex) => (
        <td key={colIndex} className="border px-4 py-2">
          {renderCellValue(row[column])}
        </td>
      ))}
    </tr>
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

function Header({ tableName }) {
  return (
    <div className="flex space-x-4 mb-4">
      <SelectButton now={tableName} path={"user"}>
        유저
      </SelectButton>
      <SelectButton now={tableName} path={"user_queue"}>
        유저큐
      </SelectButton>
      <SelectButton now={tableName} path={"post"}>
        편지
      </SelectButton>
      <SelectButton now={tableName} path={"post_queue"}>
        편지큐
      </SelectButton>
      <SelectButton now={tableName} path={"unc_post"}>
        안보내진 편지
      </SelectButton>
      <SelectButton now={tableName} path={"unidentify"}>
        없는 유저
      </SelectButton>
    </div>
  );
}

function SelectButton({ now, path, children }) {
  return (
    <Link
      href={`/admin/table/${path}`}
      className={`${now == path ? `bg-gray-500 text-white font-bold` : `bg-white`
        }border border-gray-300 px-3 py-2 `}
    >
      {children}
    </Link>
  );
}
