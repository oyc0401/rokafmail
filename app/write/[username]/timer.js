import airForceTime from './airforce-time';

export default function Timer(props) {

  let generation = props.generation;
  let searchName = props.name;
  // date 포맷
  function toStringByFormatting(source, delimiter = '.') {
    function leftPad(value) {
      if (value >= 10) {
        return value;
      }

      return `0${value}`;
    }

    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());

    return [year, month, day].join(delimiter);
  }

  let [idayStr, sdayStr, jdayStr] = airForceTime(generation);

  const today = new Date();
  const iday = new Date(idayStr); // 입대일
  const sday = new Date(sdayStr); // 수료일
  const jday = new Date(jdayStr); // 전역일

  const ipdae = Math.ceil((iday) / (1000 * 60 * 60 * 24));
  const suryo = Math.ceil((sday - today) / (1000 * 60 * 60 * 24));
  const jeonyeok = Math.ceil((jday - today) / (1000 * 60 * 60 * 24));
  const percent = Math.ceil((today - iday) / (jday - iday) * 100);

  return (
    <div>
      <div>
        <h2>공군 {generation}기 훈련병 {searchName}</h2>
        <p style={{ "margin": "0px" }}>{toStringByFormatting(iday)} ~ {toStringByFormatting(sday)}</p>
        <p style={{ "margin": "0px" }}> 훈련소 수료까지 {suryo}일</p>
        {/* <p style={{"margin": "0px"}}>전역까지 {jeonyeok}일</p>
        <p style={{"margin": "0px"}}>지금까지 {percent}%</p> */}
        <br />
      </div>
    </div>
  )
}
