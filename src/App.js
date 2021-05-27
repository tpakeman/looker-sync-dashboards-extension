import React, { useEffect, useState, useContext } from 'react'
import { Space, Box, Spinner, Heading , ComponentsProvider, Accordion, Text, Card, CardContent, Flex } from '@looker/components'
import { ExtensionProvider, ExtensionContext } from '@looker/extension-sdk-react'
import { AppContextProvider, AppContext } from './Sync/AppContext.js'
import { hot } from 'react-hot-loader/root'
import { CreateLinks } from './Sync/CreateLinks'
import { SyncDashBoards } from './Sync/SyncDashboards'
import { Help } from '@styled-icons/material'

// Tab 1 -> Create links
// 1. create links between LookML dashboards and UDDs
  // Two columns --> LookML dash single select on left; UDD dash multi select on right
  // Searchable
// 2. Button to create links
// Tab 2 -> Sync
// 1. Choose LookML dashboard
// 2. Click the sync button
// 3. Show progress
// Tab 3 --> Manage
// Display + remove links?


const WelcomeMessage = () => {
  return (
      <Box m='medium'>
      <Text style={{display:'block'}}>It is possible to 'sync' 'user defined dashboards' (UDDs) with LookML dashboards.</Text>
        <Text style={{display:'block'}}>Changes are made to the LookML and then the UDDs update their state to reflect these changes.</Text>
        <br/>
        <Text style={{display:'block'}}>This is a 2 step process:</Text>
        <Text style={{display:'block'}}>1. Create a link between the UDD and the LookML dashboard</Text>
        <Text style={{display:'block'}}>2. Instruct the LookML dashboard to 'Sync', updating all of the dependent UDDs</Text>
        <br/>
        <Text style={{display:'block', fontStyle: 'italic'}}>Note that UDDs created from LookML dashboards will be linked automatically</Text>
      </Box>
  )
}

const MsgBar = () => {
  const {msg} = useContext(AppContext)
  return (
    <></>
  )
}

const LoadingWrapper = (props) => {
  if (props.isLoading) {
    return <Space around p='xxxlarge'><Spinner size={80}/></Space>
  } else {
    return props.children
  }
}

const SyncApp = () => {
  const { core40SDK } = useContext(ExtensionContext)
  const { setDashData } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(true)
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true)

  useEffect(() => {
    const processDashboards = (v) => {
      let tmp = {UDD: {}, LookML: {}}
      v.forEach(d => {
        if (isNaN(d.id)) {
          tmp.LookML[d.id] = d
        } else {
          tmp.UDD[d.id] = d
        }
      });
      setDashData(tmp)
    }

   const initialize = async () => {
      try {
        core40SDK.all_dashboards().then(v => {
          processDashboards(v.value);
          setIsLoading(false)
        })
      } catch (error) {
        console.error(error)
      }
    }
    initialize()
  
  }, [])

  return (
  <LoadingWrapper isLoading={isLoading}>
    <Space around>
    <Flex p='xlarge'>
      <Card raised>
        <CardContent>
          <Heading as='h1'>Instructions</Heading>
          <WelcomeMessage/><hr/>
            <Heading as='h1'>1. Create links</Heading>
            <CreateLinks/><hr/>
            <Heading as='h1'>2. Sync</Heading>
            <hr/>
            <Heading as='h1'>3. Manage</Heading>
            <hr/>
        </CardContent>
      </Card>
    </Flex>
    </Space>
  </LoadingWrapper>
  )
}

// 1. Create links
// 2. Sync
// 3. Find existing links (one API call per UDD! - for 'lookml_link_id')


export const App = hot(() => {
  return (
    <ExtensionProvider>
      <ComponentsProvider>
        <AppContextProvider>
          <SyncApp />
         </AppContextProvider>
        </ComponentsProvider>
    </ExtensionProvider>
  )
})
