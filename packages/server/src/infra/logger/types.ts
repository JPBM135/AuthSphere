export interface ILoggerAdapter {
  debug(prefix: string, message: string, ...args: any[]): void;
  error(prefix: string, message: string, ...args: any[]): void;
  info(prefix: string, message: string, ...args: any[]): void;
  success(prefix: string, message: string, ...args: any[]): void;
  warn(prefix: string, message: string, ...args: any[]): void;
}

export enum LoggerLevel {
  Error,
  Info,
  Debug,
}
