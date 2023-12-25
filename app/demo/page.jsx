"use client";
import React from "react";
import CounterModel, { CounterContext } from "./model";


export default function Register() {
  const model = new CounterModel();
  return (
    <>
      <CounterContext.Provider value={model}>
        <Value />
        <Button />
      </CounterContext.Provider>
    </>
  );
}

function Value() {
  const [counter] = CounterModel.use().counterState;
  return <h2>{counter}</h2>;
}

function Button() {
  const [counter, setCounter] = CounterModel.use().counterState;
  return <button onClick={() => setCounter(counter + 1)}>+</button>;
}
