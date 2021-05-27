import React, {  useState, useContext } from 'react'
import { Button, Box, Select, Heading, InputSearch,MenuList, MenuItem, Flex, Panels, Panel, List, ListItem, omitFieldProps } from '@looker/components'
import { AppContext } from './AppContext.js'

const SearchableUDDs = (props) => {
    const {dashData} = useContext(AppContext)
    const [searchText, setSearchText] = useState('')
    const [selectedDash, setSelectedDash] = useState([])
  
    const handleClick = (e) => {
      let tmp
      if (selectedDash.includes(e)) {
        tmp = selectedDash.filter(v => v !== e)
      } else {
        tmp = [...selectedDash, e]
      }
      tmp = tmp.filter((v, i, s) => s.indexOf(v) == i)
      setSelectedDash(tmp)
      props.setSelectedDash(tmp)
    }
  
    const getUDDOptions = () => {
      if (dashData.UDD == {}) return []
      let categories = Object.values(dashData.UDD)
        .map((v) => v.folder.name)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => a-b)
        .map(e => ({
          label: e,
          options: Object.values(dashData.UDD)
            .filter(v => v.folder.name == e)
            .map(v=> ({label: v.title, value: v.id}))
        }))
      // let categorised = options.
      if (searchText === '') return categories
      return categories
        .filter(o => o.options.filter(e => e.label.toLowerCase().includes(searchText.toLowerCase())).length > 0)
        // })
    }
  
  return (
      <Box>
        <InputSearch
          placeholder='Search'
          value={searchText}
          onChange={setSearchText}
        />
        <Panels>
          <List>
          {/* <Panel title='ONS testing' content={<Text>Fuck off</Text>}>ABC</Panel> */}
            {getUDDOptions().map((e, ix) => {
              return (<Panel
                title={e.label}
                key={ix}
                direction='right'
                content={<MenuList compact>
                  {e.options.map((o) => {
                  return (
                  <MenuItem
                    onClick={() => handleClick(o.value)}
                    style={{
                      backgroundColor: selectedDash.includes(o.value) ? '#1A73E8': '',
                      color: selectedDash.includes(o.value) ? 'white': ''
                    }}
                  >
                    {o.label}
                  </MenuItem>
                    )
                })}
                  </MenuList>}>
              <ListItem>{e.label}</ListItem></Panel> )}
              )}
          </List>
        </Panels>
      </Box>
    )
  }
  
 export const CreateLinks = () => {
    const {addMsg, clearMsg, dashData} = useContext(AppContext)
    const [chosenLookML, setChosenLookML] = useState(undefined)
    const [selectedDash, setSelectedDash] = useState([])
    const [lookMLSearch, setLookMLSearch] = useState('')
  
    function handleLookMLChange(value) {
      console.log(value)
      setChosenLookML(value)
    }
  
    function handleLookMLFilter(term) {
      setLookMLSearch(term)
    }
  
    const getLookMLOptions = () => {
      if (dashData.LookML == {}) return []
      // console.log(dashData.UDD)
      let categories = Object.values(dashData.LookML)
        .map((v) => v.model.id)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => a-b)
        .map(e => ({
          label: e,
          options: Object.values(dashData.LookML)
            .filter(v => v.model.id == e)
            .map(v=> ({label: v.title, value: v.id}))
        }))
      // let categorised = options.
      if (lookMLSearch === '') return categories
      return categories
        .filter(o => o.options.filter(e => e.label.toLowerCase().includes(lookMLSearch.toLowerCase())).length > 0)
        // })
    }
  
    // useEffect(() => {
  
    // }, [chosenLookML])
  
    return (
      <Box>
        <Flex p='medium'>
        <Box m='medium'>
          <Heading as='h3' mb='small'>1. Choose LookML Dashboard</Heading>
          <Select
            minWidth={300}
            options={getLookMLOptions()}
            isClearable
            isFilterable
            value={chosenLookML}
            onChange={handleLookMLChange}
            onFilter={handleLookMLFilter}
            />
          </Box>

          <Box m='medium'>
          <Heading as='h3' mb='small'>2. Choose UDDs to sync</Heading>
            <SearchableUDDs setSelectedDash={setSelectedDash}/>
          </Box>
          </Flex>
          <Box m='medium'>
            {(selectedDash.length >0 && chosenLookML) && 
            <Button>Create Links with {selectedDash.length} UDD{selectedDash.length > 1 && 's'}</Button>
            }
          </Box>
    </Box>
    )
  }
  