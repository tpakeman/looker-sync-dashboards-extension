import React, {  useState, useContext } from 'react'
import { AppContext } from './AppContext.js'
import { Button, Box, Flex, DividerVertical } from '@looker/components'
import { ChooseDashboards } from './ChooseDashboards.js'
import { LogContainer } from './LogContainer.js'
import { isEmpty } from 'lodash'

 export const CreateLinks = () => {
    const { dashData, makeLinks } = useContext(AppContext)
    const [chosenLookML, setChosenLookML] = useState(undefined)
    const [selectedDash, setSelectedDash] = useState([])
    
    const handleCreateLinks = () => {
      if (isEmpty(selectedDash) || isEmpty(chosenLookML)) return
      makeLinks(selectedDash, chosenLookML)
    }

    return (
      <Box>
        <Flex p='medium' flexDirection='row' justifyContent='space-around' alignItems='flex-start'>
          <Flex p='small' flexDirection='column' alignItems='center' justifyContent='space-between' minWidth='30vw'>
            <Flex flexDirection='row' justifyContent='space-between'>
            <ChooseDashboards data={dashData.LookML} setSelectedDash={setChosenLookML} heading='1.Choose LookML Dashboard'/>
            <ChooseDashboards UDD data={dashData.UDD} setSelectedDash={setSelectedDash} heading='2.Choose UDDs to Link'/>
            </Flex>
          <Box m='medium'>
            {(selectedDash.length >0 && chosenLookML) && 
            <Button
              width='100%'
              onClick={handleCreateLinks}
            >Create Links with {selectedDash.length} UDD{selectedDash.length > 1 && 's'}</Button>
            }
          </Box>
          </Flex>
          <DividerVertical stretch/>
          <LogContainer/>

          </Flex>
    </Box>
    )
  }
  