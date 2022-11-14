/**
 * This currently is not a working example since we do not have everything set up to
 * create to extensions as the moment.
 *
 * TODO: make this a working example
 *
 * This demonstrates how 2 extensions could set up their respective connections via the chrome
 * apis where only one expects to send commands the other expects to receive them
 */

import {
  Client,
  CommandMessage,
  AsSuccess,
  Server,
  StatusMessage,
  SuccessStatusMessage,
} from '@hanseltime/janus-simple-command'
import { ChromeMessageConnection } from '../ChromeMessageConnection'

// Agreed upon messaging schemas as types
type Commands = 'hello'
type CommandMap = {
  hello: CommandMessage<
    'hello',
    {
      name: string
    }
  >
}
type StatusMap = {
  hello: StatusMessage<{
    msg: string
  }>
}

// Extension A
let janusSimpleCommandServer: Server<Commands, CommandMap, StatusMap>
let opened: Promise<any>
chrome.runtime.onConnectExternal.addListener(function (port) {
  // Add messaging security check for expected connections
  if (port.sender?.id !== 'extensionBId') return
  const serverConnection = new ChromeMessageConnection(port, 'server')

  const janusSimpleCommandServer = new Server<Commands, CommandMap, StatusMap>({
    maxSenderInactivity: 4000,
    maxAckRetries: 3,
    ackRetryDelay: 500,
    connection: serverConnection,
    debug: (msg) => console.log(`Extension A Server: ${msg}`),
  })
  janusSimpleCommandServer.setMessageHandler('hello', {
    handler: async (msg) => {
      return {
        isError: false,
        data: {
          msg: `hello ${msg.data.name}`,
        },
      }
    },
  })

  opened = janusSimpleCommandServer.open()

  // NOTE: you will have to figure out where you want to close() the server on your end
  // The server will close itself on connection close but your re
})

// Extension B
const port = chrome.runtime.connect('extensionAId')
const clientConnection = new ChromeMessageConnection(port, 'client')
const client = new Client<Commands, CommandMap, StatusMap>({
  commands: ['hello'],
  ackRetryDelay: 500,
  maxAckRetries: 3,
  connection: clientConnection,
  debug: (msg) => console.log(`Extension B Client: ${msg}`),
})

// Create a sender for whatever operation we want to keep going
async function myProcessWithCommands() {
  const sender = await client.createSender()
  const status = await sender.command('hello', {
    name: 'chad',
  })

  // Print the response from the extension
  console.log(
    (
      status as SuccessStatusMessage<{
        msg: string
      }>
    ).data.msg,
  )
}
