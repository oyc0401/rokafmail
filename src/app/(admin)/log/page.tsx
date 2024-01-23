const fs = require("fs");
const path = require("path");

export default function LogPage() {
  const filePath = path.join(process.cwd(), "logs/2024-01-23.log"); // 파일 경로 생성
  const byte = fs.readFileSync(filePath, "utf-8");
  //console.log(byte);

  return <pre style={{textAlign:'start'}}>{byte}</pre>;
}
