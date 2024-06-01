export interface Logger {
  error: (log: string) => void;
  warn: (log: string) => void;
  info: (log: string) => void;
}