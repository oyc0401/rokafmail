
import styles from "./mail.module.css";
import { Body } from "./body";
import { Header } from "./header";
import { Test } from "./test";
export default async function Mail({ params }) {
  return (
    <>
      <div className="scrollable">
        <div style={{ height: 17 }}></div>
        <Header username={params.username}></Header>
        <div style={{ height: 24 }}></div>
        <Body username={params.username}></Body>
      </div>
    </>
  );
}
