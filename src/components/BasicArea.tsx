import styles from "./BasicArea.module.css";

export function BasicArea({ header, body, footer }) {
  return (
    <>
      <div className="screen">
        <div className="flex flex-col-reverse" style={{ flex: 10 }}>
          <div className="pt-24 pb-14 w-full">
            <h2 className={styles.title}>{header}</h2>
          </div>
        </div>

        <div className="w-full" style={{ flex: 18 }}>
          {body}
        </div>
        <div className="pb-8 pt-6 w-full">{footer}</div>
      </div>
    </>
  );
}

function BasicHeader({ children }) {
  return (
    <div className="flex flex-col-reverse" style={{ flex: 10 }}>
      <div className="pt-24 pb-14 w-full">
        <h2 className={styles.title}>{children}</h2>
      </div>
    </div>
  );
}


function BasicBody({ children }) {}
function BasicFooter({ children }) {}