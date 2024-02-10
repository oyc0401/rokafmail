import styles from "./BasicArea.module.css";

export function BasicArea({ children }) {
  return <div className="screen">{children}</div>;
}

export function BasicHeader({ children }) {
  return (
    <div className="flex flex-col-reverse" style={{ flex: 10 }}>
      <div className="pt-24 pb-14 w-full">
        <h2 className={styles.title}>{children}</h2>
      </div>
    </div>
  );
}

export function BasicBody({ children, paddingBottom = true }) {
  return (
    <div className="w-full" style={{ flex: 18 }}>
      <div className={`${paddingBottom ? "pb-12" : null} w-full h-full`}>
        {children}
      </div>
    </div>
  );
}

export function BasicFooter({ children }) {
  return <div className="pb-8 pt-6 w-full">{children}</div>;
}
