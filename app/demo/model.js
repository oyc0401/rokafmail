import { useState, useContext, createContext } from "react";
import Provider from "./provider";

export const CounterContext = createContext();

export default class CounterModel {
  static use() {
    return Provider.use(CounterContext);
  }
  counterState = useState(1);
}
