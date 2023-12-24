import airForceTime from "./time";
import styles from "./mail.module.css";
import { getUser } from "./server/getUser";
import { Body } from "./body";
import { Header } from "./header";
export default async function Mail({ params }) {
  return (
    <>
      <div className="scrollable">
        <div style={{ height: 17 }}></div>
        <Header username={params.username}></Header>
        <div style={{ height: 30 }}></div>
        <Body username={params.username}></Body>
      </div>
    </>
  );
}
