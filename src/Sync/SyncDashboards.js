import { Button, Flex, Box, DividerVertical ,Tab,Tabs,TabList,TabPanels,TabPanel, Heading, List, ListItem} from '@looker/components'
import React, {useContext, useState} from 'react'
import { AppContext } from './AppContext'
import {isEmpty} from 'lodash'
import { ChooseDashboards } from './ChooseDashboards'
import { LogContainer } from './LogContainer'
import { RoundedBox } from './CommonComponents'

//TO DO - show what will be synced when you hit the sync button

export const SyncDashBoards = () => {
  const [chosenLookML, setChosenLookML] = useState(undefined)
  const {dashData, syncLookMLDash} = useContext(AppContext)
  const [currentTab,setCurrentTab] = useState(0)

    const handleSync = () => {
      if (isEmpty(chosenLookML)) return
      syncLookMLDash(chosenLookML)
      setCurrentTab(1)
    }

    const showInfo = () => {
      let linkedUDDs = (!isEmpty(chosenLookML)) ? dashData.LookML[chosenLookML].linked : []
      return (
        <RoundedBox>
        <Heading as='h5' p='small'>Info</Heading>
        <List style={{overflowY: 'scroll'}}>
          {linkedUDDs.length > 0 && (<>
          <ListItem disabled>Will sync the following UDDs:</ListItem>
            {linkedUDDs.map((l, ix) => {
              return <ListItem key={ix} disabled>{l}</ListItem>
            })}
          </>)}
        </List>
        </RoundedBox>
      )
    }

    return (
      <Box>
      <Flex flexDirection='row' justifyContent='space-evenly' alignContent='stretch' m='medium' height='100%'>
      <Box width='50vw'>
      <Flex  flexDirection='column' alignItems='center' justifyContent='space-between' alignContent='stretch' width='50vw'>
        <ChooseDashboards data={dashData.LookML} Fn={setChosenLookML} heading='1.Choose LookML Dashboard to Sync'/>
        <Button
        size='large'
        marginTop='medium'
        onClick={handleSync}
        disabled={!chosenLookML}
        width='50%'
        >2. SYNC!</Button>
      </Flex>
        </Box>

        <DividerVertical stretch/>
        <Box width='35vw' height='100%'>
        <Tabs index={currentTab} onChange={setCurrentTab}>
        <TabList>
        <Tab>Info</Tab>
        <Tab>Log</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{showInfo()}</TabPanel>
          <TabPanel><LogContainer/></TabPanel>
        </TabPanels>
      </Tabs>
        </Box>
      </Flex>
      </Box>
    )
  }