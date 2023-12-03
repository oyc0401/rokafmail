'use client';
import styles from './main.module.css'

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation'
import axios from "axios";

import Logo from './assets/logo.svg';

export default function Register() {
  const router = useRouter();

  const name = useRef("");
  const generation = useRef("");
  const year = useRef("");
  const month = useRef("");
  const date = useRef("");
  const username = useRef("");
  const password = useRef("");
  const [mailLink, setMailLink] = useState("");


  function fetchData() {


    axios.post('/api/register', {
      username: username.current,
      password: password.current,
      name: name.current,
      birth: `${year.current}${month.current}${date.current}`,
      generation: generation.current
    })
      .then(function(response) {
        console.log(response)
      })
      .catch(function(error) {

        console.log("오류:", error);
        // setValidate(false);
      }).finally(function() {
        // setComplete(true);
      })
  }

  const handleSubmit = async () => {

    // fetchData();


    // console.log(router)
    // let link = `https://oyc0401.site/write/${username.current}`;
    // setMailLink(link);

  }




  return (
    <>
      <div className='flex' style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '20px',
        paddingRight: '20px',
       
      }}>
        
        <div style={{ flex: 80 }}></div>
        <Logo style={{
            width: '171px', height: '171px'
          }} ></Logo>
       
        <div style={{ flex: 146 }}></div>
        <h1>공군 인편지기</h1>
        <div style={{ height: 13 }}></div>
        <h3>입대전에 인편 링크를</h3>
        <h3>만들고 공유하세요!</h3>
        <div style={{ flex: 69 }}></div>

        <div className='submit' onClick={handleSubmit}>시작하기</div>

        <div style={{ height: 11 }}></div>
        <div className={styles.helper}>도움말</div>
        <div style={{ height: 19 }}></div>
      </div>



    </>
  )
}