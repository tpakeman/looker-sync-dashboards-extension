import { Button, Flex, Box, DividerVertical } from '@looker/components'
import React, {useContext, useState} from 'react'
import { AppContext } from './AppContext'
import {isEmpty} from 'lodash'
import { ChooseDashboards } from './ChooseDashboards'
import { LogContainer } from './LogContainer'

export const SyncDashBoards = () => {
  const [chosenLookML, setChosenLookML] = useState(undefined)
  const {dashData, syncLookMLDash} = useContext(AppContext)

    const handleSync = () => {
      if (isEmpty(chosenLookML)) return
      syncLookMLDash(chosenLookML)
    }

    return (
      <Flex flexDirection='row' m='medium' justifyContent='space-around' alignItems='center'>
      <Box maxWidth='50vw'>
      <Flex flexDirection='column' m='medium' justifyContent='space-between'>
        <ChooseDashboards data={dashData.LookML} setSelectedDash={setChosenLookML} heading='1.Choose LookML Dashboard to Sync'/>
        {chosenLookML && 
        <Button
          size='large'
          marginTop='medium'
          onClick={handleSync}
          >2. SYNC!</Button>
        }
      </Flex>
        </Box>
        <DividerVertical stretch/>
          <LogContainer/>
      </Flex>
    )
  }