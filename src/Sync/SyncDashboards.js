import { Button, Flex, Box, DividerVertical ,Tab,Tabs,TabList,TabPanels,TabPanel, Heading, List, ListItem} from '@looker/components'
import React, {useContext, useState} from 'react'
import { AppContext } from './AppContext'
import {isEmpty} from 'lodash'
import { ChooseLookMLDashboards } from './ChooseDashboards'
import { LogContainer } from './LogContainer'
import { RoundedBox, FlexRowSpaceEven } from './CommonComponents'

//TO DO - show what will be synced when you hit the sync button

export const SyncDashBoards = () => {
  const [chosenLookML, setChosenLookML] = useState(undefined)
  const {dashData, syncLookMLDash, isTabletOrMobile} = useContext(AppContext)
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
      <FlexRowSpaceEven m='medium' small={isTabletOrMobile}>
      <Box width={isTabletOrMobile ? '100vw' : '50vw'} minWidth='350px'>
      <Flex flexDirection='column' alignItems='center' justifyContent='space-between' alignContent='stretch' width='80%'>
        <ChooseLookMLDashboards data={dashData.LookML} Fn={setChosenLookML} heading='Choose LookML Dashboard to Sync'/>
        <Button
        size='large'
        marginTop='medium'
        onClick={handleSync}
        disabled={!chosenLookML}
        width='50%'
        maxWidth='250px'
        minWidth='50px'
        >2. SYNC!</Button>
      </Flex>
        </Box>

        {!isTabletOrMobile && <DividerVertical stretch/>}
        <Box width={isTabletOrMobile ? '90vw' : '35vw'} marginTop={isTabletOrMobile && '20px'} minWidth='350px'>
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
      </FlexRowSpaceEven>
      </Box>
    )
  }