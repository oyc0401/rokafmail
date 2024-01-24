import Link from "next/link";

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
  let columns = Object.keys(data[0]);

  function renderCellValue(value) {
    if (typeof value === "boolean") {
      return value ? "T" : "F";
    }

    console.log(value);
    if (value instanceof Date) {
      return value.toString();
    }

    return value;
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
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="border px-4 py-2">
                  {renderCellValue(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Header({ tableName }) {
  return (
    <div className="flex space-x-4 mb-4">
      <HeadButton now={tableName} path={"user"}>
        유저
      </HeadButton>
      <HeadButton now={tableName} path={"user_queue"}>
        유저큐
      </HeadButton>
      <HeadButton now={tableName} path={"post"}>
        편지
      </HeadButton>
      <HeadButton now={tableName} path={"post_queue"}>
        편지큐
      </HeadButton>
      <HeadButton now={tableName} path={"unc_post"}>
        안보내진 편지
      </HeadButton>
      <HeadButton now={tableName} path={"unidentify"}>
        없는 유저
      </HeadButton>
    </div>
  );
}

function HeadButton({ now, path, text, children }) {
  return (
    <Link
      href={`/table/${path}`}
      className={`${
        now == path ? `bg-gray-500 text-white font-bold` : `bg-white`
      }border border-gray-300 px-3 py-2 `}
    >
      {children}
    </Link>
  );
}
