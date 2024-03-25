"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function Graph({ postCount,userCount,label,leftDate }) {

  const mergedData = {};

  for (const key in userCount) {
    mergedData[key] = {
      user: userCount[key],
      post: postCount[key] ?? 0,
    };
  }

  for (const key in postCount) {
    if (!mergedData.hasOwnProperty(key)) {
      mergedData[key] = {
        user: 0,
        post: postCount[key],
      };
    }
  }

  let keys: string[] = [];
  for (const key in mergedData) {
    if (key != "2/04" && key != "2/05") keys.push(key);
  }
  keys.sort();

  let realdata: { name; user; post }[] = [];
  let registersum = 0;
  let postsum = 0;

  console.log(keys);
  // 적분
  for (const key of keys) {
    const obj = mergedData[key];
    registersum += obj.user;
    postsum += obj.post;
    realdata.push({ name: key, user: registersum, post: postsum });
  }

  //자르기
  // for (const data of realdata) {
  //   console.log(data.name);
  //   const [mon,date]=data.name.split('/');
    
  // }

  const data = [
    { name: "Page A", uv: 400, pv: 2500, amt: 2500 },
    { name: "Page B", uv: 500, pv: 2500, amt: 2500 },
    { name: "Page C", uv: 600, pv: 2600, amt: 2600 },
    { name: "Page D", uv: 700, pv: 2700, amt: 2700 },
    { name: "Page E", uv: 800, pv: 2800, amt: 2800 },
    { name: "Page F", uv: 900, pv: 2900, amt: 2900 },
  ];
  const [html, setHtml] = useState(<>로딩중</>);

  useEffect(() => {
    const renderLineChart = (
      <div className="flex flex-col items-center">
        <p className="text-xl pb-2">{label} 사용자</p>
        <LineChart
          width={900}
          height={300}
          data={realdata}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="user" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
        <p className="text-xl pb-2">{label} 편지</p>
        <LineChart
          width={900}
          height={300}
          data={realdata}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="post" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    );
    setHtml(renderLineChart);
  }, []);

  return html;
}