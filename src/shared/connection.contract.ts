export interface Connection {
  connection(): Promise<unknown>
  close(): Promise<unknown>
}
