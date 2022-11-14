import {
  ACKMessage,
  CommandMessage,
  Connection,
  messageIsForClient,
  messageIsForServer,
  NACKMessage,
  StatusMessage,
} from '@hanseltime/janus-simple-command'

export class ChromeMessageConnection implements Connection {
  private messageHandler: ((msg: string) => Promise<void>) | undefined
  private errorHandler: ((msg: Error) => Promise<void>) | undefined
  private closeHandler: (() => Promise<void>) | undefined
  private messageListener: ((msg: any) => void) | undefined
  private closeListener: ((msg: any) => void) | undefined
  private messageFilter: (msgObj: CommandMessage<any, any> | StatusMessage<any> | ACKMessage | NACKMessage) => boolean
  private pendingHandling = new Set<Promise<any>>()
  private isOpen = false
  constructor(private port: chrome.runtime.Port, private type: 'client' | 'server') {
    this.messageFilter = this.type === 'client' ? messageIsForClient : messageIsForServer
  }

  async open(): Promise<void> {
    if (this.isOpen) return
    this.isOpen = true
    try {
      await this.registerListeners()
    } catch (err) {
      this.isOpen = false
      throw err
    }
  }

  private registerListeners() {
    this.messageListener = (msg) => {
      if (!this.messageHandler) return
      // TODO: we really should not send strings when we can send objects - add adapters to the library
      const msgIsString = typeof msg === 'string'
      const msgObj = msgIsString ? JSON.parse(msg) : msg
      if (!this.messageFilter(msgObj)) return
      let finished = false
      const promise = this.messageHandler(msgIsString ? msg : JSON.stringify(msg)).finally(() => {
        finished = true
        this.pendingHandling.delete(promise)
      })
      if (!finished) {
        this.pendingHandling.add(promise)
      }
    }
    this.port.onMessage.addListener(this.messageListener)
    this.closeListener = () => {
      let finished = false
      const promise = this.close().finally(() => {
        finished = true
        this.pendingHandling.delete(promise)
      })
      if (!finished) {
        this.pendingHandling.add(promise)
      }
    }
    this.port.onDisconnect.addListener(this.closeListener)
  }

  async sendMessage(msg: string): Promise<void> {
    // TODO: we could always deserialize here - it's just more inefficient until we add adapters on the recieve end
    this.port.postMessage(msg)
  }
  onMessage(messageHandler: (msg: string) => Promise<void>): void {
    this.messageHandler = messageHandler
  }
  onError(errorHandler: (error: Error) => Promise<void>): void {
    this.errorHandler = errorHandler
  }
  onClose(closeHandler: () => Promise<void>): void {
    this.closeHandler = closeHandler
  }
  async close(): Promise<void> {
    this.isOpen = false
    if (this.messageListener) {
      this.port.onMessage.removeListener(this.messageListener)
    }
    if (this.closeListener) {
      this.port.onDisconnect.removeListener(this.closeListener)
    }
    if (this.closeListener) await Promise.allSettled(this.pendingHandling)
    await this.closeHandler?.()
  }
}
