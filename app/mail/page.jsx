'use client';

import React, { useRef, useEffect } from 'react';
import axios from "axios";
import { useRouter, useSearchParams } from 'next/navigation'
import Write from './write';

// /mail?generation=852&searchName=곽희근&searchBirth=19950824
export default function validate() {
  const params = useSearchParams();
  const searchName = params.get('searchName');
  const searchBirth = params.get('searchBirth');
   const generation = params.get('generation');

  const [complete, setComplete] = React.useState(false);
  const [validate, setValidate] = React.useState(true);

  const memberSeqVal = useRef("");
  const sodaeVal = useRef("");

  useEffect(() => {
    console.log("서버요청!")
    fetchData();
  }, []);

  function fetchData() {
    axios.get('/api/profile', {
      params: {
        searchName: searchName,
        searchBirth: searchBirth
      }
    })
      .then(function(response) {
        let data = response.data;
        memberSeqVal.current = data.memberSeqVal;
        sodaeVal.current = data.sodaeVal;

        setValidate(true);
      })
      .catch(function(error) {
        console.log("오류:", error);
        setValidate(false);
      }).finally(function() {
        setComplete(true);
      })
  }




  


  
  if (!complete) {
    return (
      <h1>로딩중</h1>
    );
  }
  
  if (validate) {
    return (
      <Write memberSeqVal={memberSeqVal.current} sodaeVal={sodaeVal.current} searchName={searchName} generation={generation}></Write>
    );
  } else {
    return (
      <Error></Error>
    );
  }
}