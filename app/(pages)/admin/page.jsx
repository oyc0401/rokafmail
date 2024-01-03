import Link from 'next/link';

export default function Admin() {
  // 데이터 예시
  const data = [
    // 실제 데이터를 가져오거나 하드코딩해주세요.
  ];

  // 테이블 헤더 컬럼 이름
  const columns = [
    'Column1',
    'Column2',
    'Column3',
    // 필요에 따라 추가
  ];

  return (
    <div>
      <div>
        <Link href="/admin/users">
          유저
        </Link>
        <Link href="/admin/user-queue">
          유저큐
        </Link>
        <Link href="/admin/letters">
          편지
        </Link>
        <Link href="/admin/letter-queue">
          편지큐
        </Link>
        <Link href="/admin/unsent-letters">
          안보내진편지
        </Link>
      </div>
      <div>
        <table border="1">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
