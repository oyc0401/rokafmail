'use client';

export default function Timer() {
  const today = new Date();
  const iday = new Date(`2023/08/14 00:00:00`); // 입대일
  const sdday = new Date(`2023/09/15 00:00:00`); // 수료일
  const jdday = new Date(`2025/05/13 00:00:00`); // 전역일

  const suryo = Math.ceil((sdday - today) / (1000 * 60 * 60 * 24));
  const jeonyeok = Math.ceil((jdday - today) / (1000 * 60 * 60 * 24));
  const percent = Math.ceil((today - iday) / (jdday - iday) * 100);

  return (
    <div>
      <div>
        <h2>오유찬의 시간</h2>
        <p style={{"margin": "0px"}}>수료까지 {suryo}일</p>
        <p style={{"margin": "0px"}}>전역까지 {jeonyeok}일</p>
        <p style={{"margin": "0px"}}>지금까지 {percent}%</p><br/>
      </div>
    </div>
  )
}