import React, {  useState, useContext } from 'react'
import { AppContext } from './AppContext.js'
import { Button, Box, Flex, DividerVertical, Heading, List, ListItem, Tabs, TabList, TabPanels, Tab, TabPanel } from '@looker/components'
import { ChooseDashboards } from './ChooseDashboards.js'
import { LogContainer } from './LogContainer.js'
import { isEmpty } from 'lodash'
import { RoundedBox } from './CommonComponents.js'

// Fix CSS!

 export const CreateLinks = () => {
    const { dashData, makeLinks, remapLinks, removeLinks } = useContext(AppContext)
    const [selectedLookML, setSelectedLookML] = useState(undefined)
    const [selectedDash, setSelectedDash] = useState([])
    const [currentTab,setCurrentTab] = useState(0)
    
    const handleCreateLinks = () => {
      if (isEmpty(selectedDash) || isEmpty(selectedLookML)) return
      makeLinks(selectedDash, selectedLookML)
      remapLinks()
      setCurrentTab(1)
    }

    const handleRemoveLinks = () => {
      if (isEmpty(selectedDash) && isEmpty(selectedLookML)) return
      let linkedUDDs = (!isEmpty(selectedLookML)) ? dashData.LookML[selectedLookML].linked : []
      let selected = [...selectedDash, ...linkedUDDs]
      removeLinks(selected)
      remapLinks()
      setCurrentTab(1)
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
        <RoundedBox>
        <Heading as='h5' p='small'>Info</Heading>
        <List style={{overflowY: 'scroll'}}>
          {hasLink && <ListItem disabled>{linkText}</ListItem>}
          {hasUother && <ListItem disabled>{otherUText}</ListItem>}
          {hasLother && (<>
            <ListItem disabled>{` ${otherLData.length} other UDD links exist:`}</ListItem>
            {otherLData.map((d, ix) => <ListItem disabled key={ix}>{d}</ListItem>)}
            </>)}
        </List>
        </RoundedBox>
      )
    }

    return (
      <Box>
        <Flex flexDirection='row' justifyContent='space-evenly' alignContent='stretch' m='medium' height='100%'>
          <Flex flexDirection='column' alignItems='stretch' justifyContent='space-between' alignContent='stretch' width='50vw'>
            <Flex flexDirection='row' justifyContent='space-around'>
            <Box width='45%'><ChooseDashboards data={dashData.LookML} Fn={setSelectedLookML} heading='1.Choose LookML Dashboard'/></Box>
            <Box  width='45%'><ChooseDashboards multi UDD data={dashData.UDD} Fn={setSelectedDash} heading='2.Choose UDDs to Link'/></Box>
            </Flex>
          <Flex m='medium' justifyContent='space-evenly'>
            <Button
            disabled={!(selectedDash.length > 0 && selectedLookML)}
              width='40%'
              onClick={handleCreateLinks}
            >Create Links with {selectedDash.length} UDD{selectedDash.length > 1 && 's'}</Button>
            <Button
              disabled={!(selectedDash.length > 0 || selectedLookML)}
              width='40%'
              color='critical'
              onClick={handleRemoveLinks}
            >Remove Links</Button>
          </Flex>
          </Flex>
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
  