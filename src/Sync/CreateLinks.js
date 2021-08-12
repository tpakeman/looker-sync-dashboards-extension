import React, {  useState, useContext } from 'react'
import { AppContext } from './AppContext.js'
import { Button, Box, Flex, DividerVertical, Heading, List, ListItem } from '@looker/components'
import { ChooseDashboards } from './ChooseDashboards.js'
import { LogContainer } from './LogContainer.js'
import { isEmpty, without } from 'lodash'
import { RoundedBox } from './CommonComponents.js'

 export const CreateLinks = () => {
    const { dashData, makeLinks } = useContext(AppContext)
    const [selectedLookML, setSelectedLookML] = useState(undefined)
    const [selectedDash, setSelectedDash] = useState([])
    
    const handleCreateLinks = () => {
      if (isEmpty(selectedDash) || isEmpty(selectedLookML)) return
      makeLinks(selectedDash, selectedLookML)
    }

    const prettify = (o) => JSON.stringify(o, null, 2).replace(/[\[\]\"]/gm, '')

    const showInfo = () => {
      let hasLink = false
      , hasUother = false
      , hasLother = false
      , linkText = ''
      , otherUText = ''
      , otherLData = []
      let linkedUDDs = (!isEmpty(selectedLookML)) ? dashData.LookML[selectedLookML].linked : undefined
      let linkedLookMLs = selectedDash.map(d => ({id: d, link: dashData.UDD[d].lookml_link_id})).filter(v => v.link)
      if (linkedLookMLs.map(v => v.link).includes(selectedLookML)) {
        let matchedUDDs = linkedLookMLs.filter(v => v.link == selectedLookML)
        hasLink = true
        linkText = `dashboard ${selectedLookML} is already linked to UDDs: ${prettify(matchedUDDs.map(m => m.id))}`
        //Remove everything in matchedUDDs from linkedUDDs
        linkedUDDs = linkedUDDs.filter(d => !matchedUDDs.map(m=>m.id).includes(d))
        // Remove selectedLookML from linkedLookMLs
        linkedLookMLs = linkedLookMLs.filter(d => d.link !== selectedLookML)
        console.log({linkedUDDs, matchedUDDs})
      }
      if (!isEmpty(linkedUDDs)) {
        hasUother = true
        otherUText = `${hasLink ? '...and' : `${selectedLookML}  is linked to`} ${linkedUDDs.length}${hasLink ? ' other' : ''} dashboard(s): ${prettify(linkedUDDs)}`
      }
      if (!isEmpty(linkedLookMLs)) {
        hasLother = true
        otherLData = linkedLookMLs.map(l => {
          return `UDD ${l.id} is linked to ${l.link}`
        })
      }

      return (
        <List style={{overflowY: 'scroll'}}>
          {hasLink && <ListItem disabled>{linkText}</ListItem>}
          {hasUother && <ListItem disabled>{otherUText}</ListItem>}
          {hasLother && (<>
            <ListItem disabled>{` ${otherLData.length} other UDD links exist:`}</ListItem>
            {otherLData.map((d, ix) => <ListItem disabled key={ix}>{d}</ListItem>)}
            </>)}
        </List>
      )
    }

    return (
      <Box>
        <Flex flexDirection='row' justifyContent='space-around' alignItems='flex-start' m='medium'>
          <Flex flexDirection='column' alignItems='center' justifyContent='space-between' minWidth='30vw'>
            <Flex flexDirection='row' justifyContent='space-between'>
            <Box margin='0px 20px'><ChooseDashboards data={dashData.LookML} Fn={setSelectedLookML} heading='1.Choose LookML Dashboard'/></Box>
            <Box margin='0px 20px'><ChooseDashboards multi UDD data={dashData.UDD} Fn={setSelectedDash} heading='2.Choose UDDs to Link'/></Box>
            </Flex>
          <Box m='medium'>
            {(selectedDash.length >0 && selectedLookML) && 
            <Button
              width='100%'
              onClick={handleCreateLinks}
            >Create Links with {selectedDash.length} UDD{selectedDash.length > 1 && 's'}</Button>
            }
          </Box>
          </Flex>
          <DividerVertical stretch/>
          <Flex flexDirection='column' justifyContent='space-between'>
            <RoundedBox style={{minHeight: '40vh'}}>
              <Heading as='h5' p='small'>Info</Heading>
              {showInfo()}
            </RoundedBox>
            <LogContainer/>
            </Flex>

          </Flex>
    </Box>
    )
  }
  