
import styles from "./main.module.css";
import { Header } from "./header";
import { Footer } from "./footer";
export default function Help() {
  return (
    <>
      <Header></Header>
      <Body></Body>
      <Footer></Footer>
    </>
  );
}



function Body() {
  return (
    <div className="screen-not-flex pb-14">
      <div className="pt-14">
        <h2 className='text-2xl font-medium pb-8'>
          하늘인편으로
          <br />
          인편 많이 받으세요!
        </h2>
      </div>

      <p className={styles.content}>
        하늘인편은 공군 훈련소 입소 전, 지인들에게 미리 인편 링크를 공유할 수 있는 서비스입니다.

        <br />하늘인편으로 전달되는 편지를 통해 훈련 중 겪는 어려움을
        이겨내는 데 큰 도움이 되기를 바랍니다!
      </p>

      <h3 className={styles.subtitle}>간편한 편지 작성</h3>
      <p className={styles.content}>
        이제 편지를 쓸 때 번거로운 정보 입력은 필요 없습니다.
        <br />
        미리 이름과 생년월일을 등록해두면, 가족과 친구들은 쉽게 편지를 작성할 수
        있습니다.
      </p>

      <h3 className={styles.subtitle}>인편지기 대신 해드립니다</h3>
      <p className={styles.content}>
        입대 전 하늘인편에서 인터넷편지 링크를 생성하고 SNS에 공유할 수
        있습니다.
        <br />
        이젠 지인에게 인편지기를 부탁하지 않아도 됩니다.
      </p>

      <h3 className={styles.subtitle}>입대 후 바로 편지작성</h3>
      <p className={styles.content}>
        입대 직후부터 하늘인편을 통해 편지를 작성할 수 있습니다. 이렇게 작성된
        편지는 저장되었다가, 입대 후 2주가 지나면 일괄적으로 훈련병에게
        전달됩니다.
      </p>

      <h3 className={styles.subtitle}>향상된 서버 안정성</h3>
      <p className={styles.content}>
        하늘인편은 기존의 인터넷편지 서비스가 겪었던 서버 불안정 문제를
        개선하였습니다.
        <br />
        안정적인 서버 운영을 통해 편지가 제대로 전송되지 않는
        문제를 최소화하여, 편지가 당신에게 안전하게
        도착하도록 보장합니다.
      </p>

    </div>
  );
}
