import sender from "./sender.js";

const knex = require("knex")({
  // We are using PostgreSQL
  client: "postgres",
  // Use the `DATABASE_URL` environment variable we provide to connect to the Database
  // It is included in your Replit environment automatically (no need to set it up)
  connection: process.env.DATABASE_URL,

  // Optionally, you can use connection pools to increase query performance
  pool: { min: 0, max: 80 },
});

export default async function repost() {

  const unposteds = await knex('post')
    .where('posted', false);

  console.log(unposteds);

  for (const post of unposteds) {

    let user = await knex('users')
      .where('id', post.user_id).first();
    console.log(user)

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
      console.log("Status:", status);
      if (status) {
        console.log("다시 보내기 성공!")

        await knex("post")
          .where("id", post.id)
          .update({
            posted: true,
            post_at: new Date(),

          });

      } else {
        console.log("다시 보내기 실패ㅜㅜ")
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


}