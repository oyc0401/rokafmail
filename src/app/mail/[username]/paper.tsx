"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TextareaAutosize from 'react-textarea-autosize';
import { Checkbox, Divider } from "@nextui-org/react";
import AddIcon from 'public/icons/add_icon.svg';
import CloseIcon from 'public/icons/close_icon_black.svg';
import AddPhotoIcon from 'public/icons/add_a_photo_icon.svg';
import rokafLogo from "public/assets/rokaf.png";
import styles from "./paper.module.css";
import { useStore } from "./model";
import { validC } from "./valid";

export function Paper() {
  const { initial, selectedFiles, setSelectedFiles } = useStore();
  useEffect(() => {
    initial();
    return () => {
      initial();
    };
  }, [initial]);



  return (
    <div role='paper' className=' px-4 py-2 mx-4 mb-4 bg-[#FFFDF8] shadow-md flex-1 flex-col flex'  >
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

function Title() {
  const { setTitle, setClick } = useStore();
  return (
    <div className="pb-3">
      <input
        className={`${styles.form} ${styles.formTitie} text-lg font-medium`}
        type="text"
        placeholder="제목"
        onChange={(e) => {
          setTitle(e.target.value);
          setClick(true);
        }}
      ></input>
    </div>
  );
}

function Contents() {
  const { contents, setContents, setClick, selectedFiles, setSelectedFiles } = useStore();
  const inputRef = useRef<any>(null);
  const handleClick = () => {
    // input 요소에 포커스를 주기
    inputRef.current.focus();
  };

  const handleFileChange = (event) => {
    console.log(event.target.files)
    const files: File[] = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  return (
    <div className="flex-1 pb-2.5 flex flex-col" >
      <TextareaAutosize
        className={`${styles.form} text-base ${styles.contentForm} min-h-36 resize-none`}
        placeholder="내용"
        ref={inputRef}
        onChange={(e) => {
          setContents(e.target.value);
          setClick(true);
        }}
      ></TextareaAutosize>
      <div className="flex-1 cursor-text" onClick={handleClick}></div>
      <AddImage></AddImage>

      <input id="file-input" type="file" multiple onChange={handleFileChange} className="hidden" />
      <div className={styles.formLine}></div>

      <div className="flex flex-row pt-0.5">
        <p className={`text-xs font-fontmedium text-left ${validC(contents).color}`}>
          {validC(contents).text}
        </p>
        <div style={{ flex: 1 }}></div>
        <p className={`text-xs font-fontmedium text-left text-[#B2A18F]`}>{`${contents.length}/1200`}</p>
      </div>
    </div>
  );
}

function AddImage() {
  const { selectedFiles, setSelectedFiles } = useStore();
  const handleRemoveImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  if (selectedFiles.length == 0) {
    return (
      <>
        <div className="flex flex-row justify-end">
          <label htmlFor="file-input" className="flex-none pb-2 px-1 cursor-pointer" >
            <Image className="w-[24px] h-[24px]" src={AddPhotoIcon} alt='사진 추가' ></Image>
          </label>
        </div>

      </>
    );
  }
  return (
    <>
      <div className="flex overflow-x-auto mt-4 mb-4 w-full scrollbar-hide">
        {selectedFiles.map((file, index) => (
          <div key={index} className="relative flex-none h-[80px] w-[80px] mr-2">
            <img src={URL.createObjectURL(file)} alt="Selected" className="object-cover h-full w-full rounded" />
            <button
              className="absolute top-0 right-0"
              style={{ width: '24px', height: '20px' }}
              onClick={() => handleRemoveImage(index)}
            >
              <Image src={CloseIcon} alt="Remove" className="w-[12px] h-[12px] m-auto" />
            </button>
          </div>
        ))}
        <label htmlFor="file-input" className="h-[80px] w-[80px] rounded bg-[#C5B8A9] active:bg-[#D8CFC3] flex-none
          cursor-pointer flex justify-center items-center">
          <Image className="w-[24px] h-[24px]" src={AddIcon} alt='사진 추가' ></Image>
        </label>
      </div>



    </>
  )
}




function Name() {
  const { setName, setRelationship, setClick } = useStore();

  return (
    <div className="pb-4">
      <div className="flex flex-row">
        <h2 className="text-base flex-1 text-right text-[#37271A]">
          From
        </h2>
        <div className="flex-1 pl-2.5">
          <input
            className={`${styles.form} text-base text-center`}
            type="text"
            placeholder="이름"
            onChange={(e) => {
              setName(e.target.value);
              setClick(true);
            }}
          ></input>
        </div>

        <div className="flex-1 pl-2.5">
          <input
            className={`${styles.form} text-base text-center`}
            type="text"
            style={{ flex: "1" }}
            placeholder="관계"
            onChange={(e) => {
              setRelationship(e.target.value);
              setClick(true);
            }}
          ></input>
        </div>
      </div>
    </div>
  );
}

function Password() {
  const { password, setPassword, isPublic, setIsPublic, setClick } = useStore();
  return (
    <div className="pb-2">
      <div className="flex flex-row">
        <div className="flex-[2_2_0%] pl-2.5 flex justify-end">
          <Checkbox
            classNames={{ base: 'h-[24px] p-0 m-0 text-[#37271A]' }}
            radius="sm"
            isSelected={isPublic} onValueChange={setIsPublic}
            className="text-[#37271A]"
          >
            <p className="text-base text-[#37271A]">전체공개</p>
          </Checkbox>
          <Divider orientation="vertical" className="mx-3" />
          <h2 className="text-base text-right text-[#37271A]" >
            비밀번호
          </h2>
        </div>

        <div className="flex-1 pl-2.5">
          <input
            className={`${styles.form} text-base text-center`}
            type="password"
            autoComplete="new-password"
            placeholder="4자리 이상"
            onChange={(e) => {
              setPassword(e.target.value);
              setClick(true);
            }}
          ></input>
        </div>
      </div>
      <div>
        <p className={`text-xs text-right pt-1.5 text-[#B2A18F]`}>
          작성 후 수정 및 삭제를 위해 사용됩니다
        </p>
      </div>
    </div>
  );
}
