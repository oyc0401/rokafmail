import styles from "./TextArea.module.css";
import React from 'react';

export function TextArea({
  className,
  type = "text",
  value,
  placeholder,
  autoComplete,
  onChange,
  children,
}: {
  className?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  autoComplete?: string;
  onChange?: (e: string) => any;

  children?: React.ReactNode;
}) {


  return (
    <div className={`flex flex-row w-full items-center flex-1 ${className}`}>
      <input
        className={styles.form}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onInput={(e: React.FormEvent<HTMLInputElement>) => {
          const text = e.currentTarget.value;
          if (onChange != null) onChange(text);
        }}
      />
      {children}
    </div>
  );
}

function SignInButton() {


}