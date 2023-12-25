"use client";
import React from "react";
import { useStore } from "./model";



export default function Register() {
  return (
    <>
      <BearCounter />
      <Controls />
      <Remove></Remove>
    </>
  );
}
function BearCounter() {
  const bears = useStore.use.bears();
  return <h1>{bears} around here...</h1>;
}

function Controls() {
  const increase = useStore.use.increase();
  return <button onClick={increase}>one up</button>;
}

function Remove() {
  const removeAllBears = useStore.use.removeAllBears();
  return <button onClick={removeAllBears}>remove</button>;
}
