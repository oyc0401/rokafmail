import Link from "next/link";
export function Table(props) {
  const data = props.data;
  const columns = Object.keys(data[0]);

  function renderCellValue(value) {
    if (typeof value === 'boolean') {
      return value ? 'T' : 'F';
    } else {
      return value;
    }
  }
  
  return (
    <>
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
