"use client";

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Profile } from "./profile";

export default function Client() {
  const { data: session, status } = useSession();
  if (!session?.user) {
  } else if (status === "authenticated") {
    console.log(session.user);
    // router.push(`profile/${session.user.email}`)
    return (
      <>
        <Profile username={session.user.email}></Profile>
        <p>Signed in as {session.user.name}</p>
        <button
          onClick={() => {
            signOut();
          }}
        >
          log out
        </button>
      </>
    );
  }

  return <a href="/api/auth/signin">Sign in</a>;



// //////

//   const [username, setUsername] = useState("");
//   const [password, setpassword] = useState("");
//   const [message, setMessage] = useState("");

  
//   function validP() {
//     // 빈칸일 때
//     if (password == "") return { text: "", valid: false };

//     // 통과
//     return { text: "", color: "great", valid: true };
//   }

//   function validU() {
//     // 빈칸일 때
//     if (username == "") return { text: "", valid: false };

//     // 통과
//     return { text: "", color: "great", valid: true };
//   }

//   async function click() {
//     signIn();
//     // if (!canSubmit()) return;

//     // const data = await login(username, password);

//     // if (data.status == 200) {
//     //   alert("로그인 성공!");
//     //    //setCookie(encryptedPassword, username);
//     // } else {
//     //   alert(`로그인 실패 ${data.message}`);
//     // }
//   }

//   function canSubmit() {
//     return validU().valid && validP().valid;
//   }

//   return (
//     <>
//       <div className="screen">
//         <div style={{ flex: 64 }}></div>
//         <div className="pt-12 pb-8 w-full">
//           <h2 className={styles.title}>
//             수료 후 편지함 확인을 위해
//             <br />
//             비밀번호를 설정해주세요
//           </h2>
//         </div>

//         <div style={{ flex: 12 }}></div>

//         <div className="pb-4 w-full">
//           <p className={styles.formTitle}>아이디</p>
//           <div style={{ height: 2 }}></div>
//           <input
//             className={styles.form}
//             placeholder="아이디를 입력해주세요"
//             onChange={(e) => {
//               setUsername(e.target.value);
//             }}
//           ></input>
//           <div style={{ height: 19 }}></div>
//         </div>

//         <div className="pb-4 w-full">
//           <p className={styles.formTitle}>비밀번호</p>
//           <div style={{ height: 2 }}></div>
//           <input
//             className={styles.form}
//             type="password"
//             placeholder="비밀번호를 입력해주세요"
//             onChange={(e) => {
//               setpassword(e.target.value);
//             }}
//           ></input>
//           <div style={{ height: 19 }}></div>
//         </div>

//         <div style={{ height: 95 + 16 }}></div>

//         <div style={{ flex: 90 }}></div>
//         <div className="pb-8 pt-6 w-full">
//           <button
//             className={canSubmit() ? "submit" : "submit disable"}
//             onClick={click}
//           >
//             편지함 열기
//           </button>
//         </div>
//       </div>
//     </>
//   );
}
