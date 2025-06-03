export interface IElectronAPI {
  on: (channel: string, callback: (...args: any[]) => void) => void
  off: (channel: string, callback?: (...args: any[]) => void) => void
  send: (channel: string, ...args: any[]) => void
  invoke: (channel: string, ...args: any[]) => Promise<any>
}

declare global {
  interface Window {
    ipcRenderer: IElectronAPI
  }
}