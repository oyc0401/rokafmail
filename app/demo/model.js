import { useState, useContext, createContext } from "react";
import Provider from "./provider";

export default counterModel={
  
  counterState = useState(1);

  getCounter(){
    return this.counterState[0];
  }

  plus(){
    const [counter, setCounter] = this.counterState;
    setCounter(counter+1);
  }
}
