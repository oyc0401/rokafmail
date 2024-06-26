"use client";
import styles from "./paper.module.css";
import rokafLogo from "public/assets/rokaf.png";
import Image from "next/image";
import TextareaAutosize from 'react-textarea-autosize';


export function Paper({ post }) {
  const { title, contents, name, relationship, isPublic } = post;

  function Title() {
    return (
      <div className="pb-4">
        <p className={`${styles.form} text-lg font-medium text-left`} >
          {title}
        </p>
      </div>
    );
  }

  function Contents() {
    return (

      <div className="flex-1 pb-4" >
        <TextareaAutosize
          className={`${styles.form} text-base ${styles.contentForm} min-h-36 resize-none`}
          placeholder="내용"
          value={contents}
          readOnly
        ></TextareaAutosize>

        <div className={styles.formLine}></div>

        <div className="row pt-0.5">
          <p className={`text-xs font-fontmedium text-left`}> </p>
          <div style={{ flex: 1 }}></div>
          <p className={`text-xs font-fontmedium text-left`}>{``}</p>
        </div>
      </div>
    );
  }


  function Name() {
    return (
      <div className="pb-3">
        <div className="row">
          <h2 className="text-base flex-1 text-right" style={{ color: "#37271A" }}>
            From
          </h2>

          <div className="flex-1 pl-2.5">
            <input
              className={`${styles.form} text-base text-center`}
              type="text"
              placeholder="이름"
              value={name}
              readOnly
            ></input>
          </div>

          <div className="flex-1 pl-2.5">
            <input
              className={`${styles.form} text-base text-center`}
              type="text"
              style={{ flex: "1" }}
              placeholder="관계"
              value={relationship}
              readOnly
            ></input>
          </div>
        </div>
      </div>
    );
  }

  function Password() {
    if (isPublic) {
      return <p className="pb-2 text-right text-xs text-fontlight">전체공개</p>
    } else {
      return <p className="pb-2 text-right text-xs text-fontlight">비공개</p>
    }
  }


  return (
    <div role='paper' className=' px-4 py-2 mx-4 mb-4 bg-[#FFFDF8] shadow-md'  >
      <div className="w-full p-3">
        <Image
          src={rokafLogo}
          alt="airforce"
          style={{
            width: 63,
            height: 26,
            margin: "auto",
          }}
        ></Image>
      </div>

      <Title></Title>
      <Contents></Contents>
      <Name></Name>
      <Password></Password>

    </div>
  );



}
