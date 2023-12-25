import { useState, useContext, createContext } from "react";


export default class Provider{
  static use(context) {
    const value = useContext(context);
    if (value === undefined) {
      throw new Error("useCounterState should be used within CounterProvider");
    }
    return value;
  }
}