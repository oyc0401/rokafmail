"use client";
import React from "react";
import { useState, useContext, createContext } from "react";
// import CounterModel, { CounterContext } from "./model";

const context = createContext();


export default function Register() {
  let counterModel = {
    counterState: useState(1),
    getCounter() {
      return this.counterState[0];
    },

    plus() {
      const [counter, setCounter] = this.counterState;
      setCounter(counter + 1);
    },
  };


  
  return (
    <>
      <context.Provider value={counterModel}>
        <Value />
        <Button />
      </context.Provider>
    </>
  );
}

function Value() {
  const [counter] = useContext(context).counterState;
  return <h2>{counter}</h2>;
}

function Button() {
  const [counter, setCounter] = useContext(context).counterState;
  function plus() {
    useContext(context).plus()
  }
  return <button onClick={plus}>+</button>;
}
