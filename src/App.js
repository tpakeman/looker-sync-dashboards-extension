import React, { useState, useContext } from 'react'
import { Text, Box, Space, Spinner, ComponentsProvider, Flex, Tabs, Tab, TabList, TabPanel, TabPanels, MessageBar, Heading } from '@looker/components'
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
    return <Space around p='xxxlarge'>
      <Text>Loading dashboards...</Text>
      <Spinner size={50} color='purple'/>
      </Space>
  } else {
    return props.children
  }
}

const TabbedNav = (props) => {
  return (
    <Box style={{minWidth: '100vw'}}>
      <Tabs index={props.currentTab} onChange={props.setCurrentTab}>
        <TabList>
        {props.pages.map(p => <Tab key={p.ix}>{p.title}</Tab>)}
        </TabList>
        <TabPanels>
          {props.pages.map(p => <TabPanel key={p.ix}>
            <Flex flexDirection='column'>
              <Heading>{p.heading}</Heading>
              {p.content}
            </Flex>
            </TabPanel>)}
        </TabPanels>
      </Tabs>
    </Box>
  )
}

const AppInner = () => {
  const { isLoading } = useContext(AppContext)
  const [currentTab, setCurrentTab] = useState(DEFAULTPAGE)
  return (
    <LoadingWrapper isLoading={isLoading}>
      <Space around>
      <Flex flexDirection='column' alignItems='flex-start' p='medium' width='100%'>
        <MessageBanner/>
        <TabbedNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          pages={PAGES}
        />
      </Flex>
      </Space>
    </LoadingWrapper>
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
