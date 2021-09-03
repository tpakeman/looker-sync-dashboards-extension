import React, {  useState, useContext } from 'react'
import { AppContext } from './AppContext.js'
import { Button, Box, Flex, DividerVertical, Heading, List, ListItem, Tabs, TabList, TabPanels, Tab, TabPanel } from '@looker/components'
import { ChooseLookMLDashboards, ChooseUDDs } from './ChooseDashboards.js'
import { LogContainer } from './LogContainer.js'
import { isEmpty } from 'lodash'
import { RoundedBox, FlexRowSpaceEven } from './CommonComponents.js'

// Fix CSS!

 export const CreateLinks = () => {
    const { dashData, makeLinks, remapLinks, removeLinks, isTabletOrMobile } = useContext(AppContext)
    const [selectedLookML, setSelectedLookML] = useState(undefined)
    const [selectedDash, setSelectedDash] = useState([])
    const [currentTab,setCurrentTab] = useState(0)
    const [currentDashTab,setCurrentDashTab] = useState(0)
    
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
      , hasNone = true
      , hasUother = false
      , hasLother = false
      , linkText = ''
      , otherUText = ''
      , otherLData = []
      , linkedUDDs = (!isEmpty(selectedLookML)) ? dashData.LookML[selectedLookML].linked : undefined
      , linkedLookMLs = selectedDash.map(d => ({id: d, link: dashData.UDD[d].lookml_link_id})).filter(v => v.link)
      
      if (linkedLookMLs.map(v => v.link).includes(selectedLookML)) {
        let matchedUDDs = linkedLookMLs.filter(v => v.link == selectedLookML)
        hasLink = true
        hasNone = false
        linkText = `dashboard ${selectedLookML} is already linked to UDDs: ${prettify(matchedUDDs.map(m => m.id))}`
        //Remove everything in matchedUDDs from linkedUDDs
        linkedUDDs = linkedUDDs.filter(d => !matchedUDDs.map(m=>m.id).includes(d))
        // Remove selectedLookML from linkedLookMLs
        linkedLookMLs = linkedLookMLs.filter(d => d.link !== selectedLookML)
      }
      if (!isEmpty(linkedUDDs)) {
        hasUother = true
        hasNone = false
        otherUText = `${hasLink ? '...and' : `${selectedLookML}  is linked to`} ${linkedUDDs.length}${hasLink ? ' other' : ''} dashboard(s): ${prettify(linkedUDDs)}`
      }
      if (!isEmpty(linkedLookMLs)) {
        hasLother = true
        hasNone = false
        otherLData = linkedLookMLs.map(l => {
          return `UDD ${l.id} is linked to ${l.link}`
        })
      }

      return (
        <RoundedBox>
        <Heading as='h5' p='small'>Info</Heading>
        <List style={{overflowY: 'scroll'}}>
          {hasNone && <ListItem disabled>
            {!isEmpty(selectedLookML) || !isEmpty(selectedDash)
          ? 'No existing links for selected dashboards'
          : 'Existing links will be shown here'
          }</ListItem>}
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

    const linkButtonText = () => {
      let txt = 'Create Links'
      if (!isTabletOrMobile) {
        txt += `with ${selectedDash.length} UDD`
      }
      if (selectedDash.length > 1) {
        txt += 's'
      }
      return txt
    }

    return (
      <Box>
        <FlexRowSpaceEven m='medium' small={isTabletOrMobile}>
          <Flex flexDirection='column' alignItems='stretch' justifyContent='space-between' alignContent='stretch' width={isTabletOrMobile ? '100vw' : '50vw'}>
            { isTabletOrMobile 
            ? <Tabs index={currentDashTab} onChange={setCurrentDashTab}>
              <TabList>
              <Tab>1. Choose LookML</Tab>
              <Tab>2. Choose UDDs </Tab>
              </TabList>
              <TabPanels>
                <TabPanel><Box margin='auto' width='90%'><ChooseLookMLDashboards data={dashData.LookML} Fn={setSelectedLookML} heading='1.Choose LookML Dashboard'/></Box></TabPanel>
                <TabPanel><Box  margin='auto' width='90%'><ChooseUDDs heading='2.Choose UDDs to Link'  data={dashData.UDD} Fn={setSelectedDash} /></Box></TabPanel>
              </TabPanels>
              </Tabs>
              : <Flex flexDirection='row' justifyContent='space-around'>
                <Box width='45%'><ChooseLookMLDashboards data={dashData.LookML} Fn={setSelectedLookML} heading='1.Choose LookML Dashboard'/></Box>
                <Box  width='45%'><ChooseUDDs heading='2.Choose UDDs to Link'  data={dashData.UDD} Fn={setSelectedDash} /></Box>
            </Flex>
            }
          <Flex m='medium' justifyContent='space-evenly'>
            <Button
            disabled={!(selectedDash.length > 0 && selectedLookML)}
              width='40%'
              onClick={handleCreateLinks}
            >{linkButtonText()}</Button>
            <Button
              disabled={!(selectedDash.length > 0 || selectedLookML)}
              width='40%'
              color='critical'
              onClick={handleRemoveLinks}
            >Remove Links</Button>
          </Flex>
          </Flex>
          {!isTabletOrMobile && <DividerVertical stretch/>}
          <Box width={isTabletOrMobile ? '90vw' : '35vw'} height='100%'>

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
  