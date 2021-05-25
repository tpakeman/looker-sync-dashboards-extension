import React from 'react'
import { SyncAppMain } from './SyncDashBoards'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { hot } from 'react-hot-loader/root'

export const App = hot(() => {
  return (
    <ExtensionProvider>
      <SyncAppMain />
    </ExtensionProvider>
  )
})
