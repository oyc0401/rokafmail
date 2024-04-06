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

import { parseKorea, strToDayjs } from "src/lib/time";

export function Graph({ postCount, userCount, label, leftDate }) {

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
    keys.push(key);
  }
  keys.sort();

  let realdata: { name; user; post }[] = [];
  let registersum = 0;
  let postsum = 0;


  // 적분

  const left = parseKorea(leftDate)

  for (const key of keys) {
    const obj = mergedData[key];
    registersum += obj.user;
    postsum += obj.post;

    // 자르기
    const date = strToDayjs(key);
    //console.log(date);
    if (left.isBefore(date)) {
      realdata.push({ name: date.format('YY.MM.DD'), user: registersum, post: postsum });
    }
  }
  //console.log(realdata);
  const [html, setHtml] = useState(<>로딩중</>);

  // useEffect(() => {
  //   const renderLineChart = (
  //     <div className="flex flex-col items-center">
  //       <p className="text-xl pb-2">{label} 사용자</p>
  //       <LineChart
  //         width={900}
  //         height={300}
  //         data={realdata}
  //         margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
  //       >
  //         <Line type="monotone" dataKey="user" stroke="#8884d8" />
  //         <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
  //         <XAxis dataKey="name" />
  //         <YAxis />
  //         <Tooltip />
  //       </LineChart>
  //       <p className="text-xl pb-2">{label} 편지</p>
  //       <LineChart
  //         width={900}
  //         height={300}
  //         data={realdata}
  //         margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
  //       >
  //         <Line type="monotone" dataKey="post" stroke="#8884d8" />
  //         <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
  //         <XAxis dataKey="name" />
  //         <YAxis />
  //         <Tooltip />
  //       </LineChart>
  //     </div>
  //   );
  //   setHtml(renderLineChart);
  // }, []);

  return (<div className="flex flex-col items-center">
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
  </div>);
}