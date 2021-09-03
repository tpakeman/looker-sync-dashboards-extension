import React, { useState, useContext } from 'react'
import { Box, Space, Spinner, ComponentsProvider, Flex, Tabs, Tab, TabList, TabPanel, TabPanels, MessageBar, Heading } from '@looker/components'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { AppContextProvider, AppContext } from './Sync/AppContext.js'
import { isEmpty } from 'lodash'
import { hot } from 'react-hot-loader/root'
import { CreateLinks } from './Sync/CreateLinks'
import { SyncDashBoards } from './Sync/SyncDashboards'
import { InfoPage } from './Sync/InfoPage'

const PAGES = [
  { ix: 0, title: '1. Information', heading: 'Information', content: <InfoPage/>},
  { ix: 1, title: '2. Create Links', heading: 'Create Links', content: <CreateLinks/>},
  { ix: 2, title: '3. Sync Dashboards', heading: 'Sync Dashboards', content: <SyncDashBoards/>}
  ]
const DEFAULTPAGE = 0

const MessageBanner = () => {
  const { msg } = useContext(AppContext)
  return (isEmpty(msg)) ? <></> : <MessageBar intent={msg.intent}>{msg.content}</MessageBar>
}

const LoadingWrapper = (props) => {
  if (props.isLoading) {
    return (
    <Flex flexDirection='column' justifyContent='space-around' alignContent='center' alignItems='center'>
      <Heading as='h3'>Loading dashboards and folders</Heading>
      <Spinner/>
      </Flex>
    )
  } else {
    return props.children
  }
}

const TabbedNav = (props) => {
  const { isLoading } = useContext(AppContext)
  return (
    <Box width='100%' height='100%'>
      <Tabs index={props.currentTab} onChange={props.setCurrentTab}>
        <TabList>
        {props.pages.map(p => <Tab key={p.ix}>{p.title}</Tab>)}
        </TabList>
        <TabPanels height='100%'>
          {props.pages.map(p => <TabPanel key={p.ix}>
            <Flex flexDirection='column' height='100%' justifyContent='flex-start'>
              <Heading>{p.heading}</Heading>
              {p.ix > 0 ? <LoadingWrapper isLoading={isLoading}>{p.content}</LoadingWrapper> : p.content}
            </Flex>
            </TabPanel>)}
        </TabPanels>
      </Tabs>
    </Box>
  )
}

const AppInner = () => {
  const [currentTab, setCurrentTab] = useState(DEFAULTPAGE)
  return (
      // <Space around height='100%'>
      <Flex flexDirection='column' alignItems='flex-start' alignContent='stretch' p='medium' width='100%' height='100%'>
        <MessageBanner/>
        <TabbedNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          pages={PAGES}
        />
      </Flex>
      // </Space>
  )
}

export const App = hot(() => {
  return (
    <ExtensionProvider>
      <ComponentsProvider>
        <AppContextProvider>
          <AppInner />
         </AppContextProvider>
        </ComponentsProvider>
    </ExtensionProvider>
  )
})
