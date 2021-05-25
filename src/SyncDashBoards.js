import React, { useEffect, useState, useContext } from 'react'
import { Space, ComponentsProvider, Text } from '@looker/components'
import { ExtensionContext } from '@looker/extension-sdk-react'

// Tab 1 -> Create links
// 1. create links between LookML dashboards and UDDs
  // Two columns --> LookML dash single select on left; UDD dash multi select on right
  // Searchable
// 2. Button to create links
// Tab 2 -> Sync
// 1. Choose LookML dashboard
// 2. Click the sync button
// 3. Show progress

const createLinks = () => {}
const SyncDashBoards = () => {}


export const SyncAppMain = () => {
  const { core40SDK } = useContext(ExtensionContext)
  const [message, setMessage] = useState()

  useEffect(() => {
    const initialize = async () => {
      try {
        const value = await core40SDK.ok(core40SDK.me())
        setMessage(`Hello, ${value.display_name}`)
      } catch (error) {
        setMessage('Error occured getting information about me!')
        console.error(error)
      }
    }
    initialize()
  }, [])

  return (
    <>
      <ComponentsProvider>
        <Space p="xxxxxlarge" width="100%" height="50vh" around>
          <Text p="xxxxxlarge" fontSize="xxxxxlarge">
            {message}
          </Text>
        </Space>
      </ComponentsProvider>
    </>
  )
}
