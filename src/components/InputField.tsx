import styles from "./InputField.module.css";

export function InputField({
  label,
  type = "text",
  value,
  placeholder,
  autoComplete,
  onChange,
  helpMessage,
  color,
  children,
}: {
  label?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  autoComplete?: string;
  onChange?: (event: string) => any;
  helpMessage?: string;
  color?: string;
  children?: React.ReactNode;
}) {


  return (
    <div className="pb-4 w-full">
      {label ? <p className={styles.label}>{label}</p> : null}

      <div className="flex flex-row w-full items-center"      >
        <input
          className={styles.form}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onInput={(e: React.FormEvent<HTMLInputElement>) => {
            const text = e.currentTarget.value;
            if (onChange) onChange(text);
          }}

          style={{ flex: 1 }}
        />
        {children}
      </div>
      {helpMessage != undefined ? (
        <p className={`text-xs h-4 pt-0.5 text-fontmedium w-full text-left ${color}`}>{helpMessage}</p>
      ) : null}
    </div>
  );
}
