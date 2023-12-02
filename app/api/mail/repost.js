import sender from "./sender.js";

// knex
const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});


export default async function repost() {

  
  const unposteds = await knex('post')
    .where('posted', false);

  console.log("repost: 편지 보내기 시작, 미발송 편지 수:", unposteds.length)

  for (const post of unposteds) {

    let user = await knex('users')
      .where('id', post.user_id).first();
   // console.log(user)

    if (user.connect) {

      let status = await sender({
        senderName: post.name,
        relationship: post.relationship,
        title: post.title,
        contents: post.contents,
        password: post.password,
        sodaeVal: user.sodae,
        memberSeqVal: user.memberSeq
      })
    
      if (status) {
        // console.log("다시 보내기 성공!")

        await knex("post")
          .where("id", post.id)
          .update({
            posted: true,
            post_at: new Date(),
          });

      } else {
        console.log("repost: 다시 보내기 실패ㅜㅜ")
        return;
      }

      // await sender({
      //   senderName: post.name,
      //   relationship: post.relationship,
      //   title: post.title,
      //   contents: post.contents,
      //   password: post.password,
      //   sodaeVal: user.sodae,
      //   memberSeqVal: user.memberSeq
      // })
      //   .then(async (status) => {
      //     console.log("Status:", status);
      //     if (status) {
      //       console.log("다시 보내기 성공!")

      //       await knex("post")
      //         .where("id", post.id)
      //         .update({
      //           posted: true,
      //           posted_at: new Date(),

      //         });

      //     } else {
      //       console.log("다시 보내기 실패ㅜㅜ")
      //       return;
      //     }
      //   });



    }




  }

  console.log("repost: 모든 편지를 보냈습니다.")
}