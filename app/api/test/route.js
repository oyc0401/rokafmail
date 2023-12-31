import axios from "axios";
import Rokaf from "../rokaf/rokaf";
export async function GET(request) {
  // for (let i = 1; i <= 12; i++) {
  //   for (let j = 1; j <= 31; j++) {
  //     let m=i;
  //     let d=j;
  //     if (i < 10) {
  //       m = `0${i}`;
  //     }

  //     if (j < 10) {
  //       d = `0${j}`;
  //     }

  //     let date = `2003${m}${d}`;
  //     console.log(date);

  //     let profile = await Rokaf.getProfile("김준식",  date);

  //     if(profile.connect){
  //       console.log("찾음!",date)
  //       return new Response(200);
  //     }
  //   }
  // }
// 김준식 20031206
  // console.log("못찾음..")
  //let profile = await Rokaf.getProfile("김준식", "20030101");
  // console.log(profile);
  // let profile = await Rokaf.getProfile("김영현", "20230101");

  // let data = await axios.post(
  //   "https://airforce-mail.oyc0401.repl.co/api/mail",
  //   {
  //     username: 'oyc0401',
  //     name: "안녕",
  //     relationship: "친구",
  //     title: "반가워용",
  //     contents: "잘다녀와",
  //     password: "3333",
  //   },
  // );

  // const knex = require("knex")({
  //   client: "postgres",
  //   connection: process.env.DATABASE_URL,
  //   pool: { min: 0, max: 80 },
  // });

  // console.log("코드 실행!");

  // console.log("post 업로드 중...");
  // let mail = {
  //   user_id: 33,
  //   name: "body.name",
  //   relationship: "body.relationship",
  //   title: "body.title",
  //   contents: "body.contents",
  //   password: "body.password",
  // };
  // // add mail
  // let post_id = await knex("post").returning("id").insert(mail);
  // console.log("post 업로드 성공!");
  // console.log(post_id);
  // console.log(post_id[0].id);

  // knex.destroy();
  return new Response(200);
}
