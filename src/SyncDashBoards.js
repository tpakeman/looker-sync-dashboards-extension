import React, { useEffect, useState, useContext, useMemo, createContext } from 'react'
import { Space, ComponentsProvider, Text, Button, Flex, Box, FlexItem, Select, SelectMulti, Spinner, Heading, InputSearch,MenuList
,MenuItem } from '@looker/components'
import { ExtensionContext } from '@looker/extension-sdk-react'

// Tab 1 -> Create links
// 1. create links between LookML dashboards and UDDs
  // Two columns --> LookML dash single select on left; UDD dash multi select on right
  // Searchable
// 2. Button to create links
// Tab 2 -> Sync
// 1. Choose LookML dashboard
// 2. Click the sync button
// 3. Show progress
// Tab 3 --> Manage
// Display + remove links?

const AppContext = createContext()
const AppContextProvider = (props) => {
  const [msg, setMsg] = useState([])
  const [dashData, setDashData] = useState({})
  const addMsg = (m) => {
    let tmp = [...msg]
    tmp.push(msg)
    setMsg([...tmp])
  }
  const clearMsg = () => {
    setMsg([])
  }
  const contextValue = {
    msg,
    addMsg,
    clearMsg,
    dashData,
    setDashData
  }
  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  )
}



const NavBar = () => {
  return (
    <></>
  )
}

const MsgBar = () => {
  const {msg} = useContext(AppContext)
  return (
    <></>
  )
}

const SearchableUDDs = () => {
  const {dashData} = useContext(AppContext)
  const [searchText, setSearchText] = useState('')

  const handleClick = (e) => {
    console.log(e)
  }

  const getUDDOptions = () => {
    let options = Object.values(dashData.UDD).map((v) => ({label: v.title, value: v.id}))
    return searchText === ''
      ? options  
      : options.filter((e) =>
        e.label.toLowerCase().includes(searchText.toLowerCase()))
  }

return (
    <Box>
      <InputSearch
        placeholder='Search'
        value={searchText}
        onChange={setSearchText}
      />
      <MenuList compact >
          {getUDDOptions().sort().map((e, ix) => (
            <MenuItem key={ix} onClick={() => handleClick(e.value)}>
              {e.label}
            </MenuItem>
          ))}
        </MenuList>
    </Box>
  )
}

const CreateLinks = () => {
  const {addMsg, clearMsg, dashData} = useContext(AppContext)
  const [chosenLookML, setChosenLookML] = useState(undefined)
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
    let options = Object.values(dashData.LookML).map((v) => ({label: v.title, value: v.id}))
    if (lookMLSearch === '') return options
    return options.filter(o => {
      return o.label.toLowerCase().indexOf(lookMLSearch.toLowerCase()) > -1
    })
  }

  // useEffect(() => {

  // }, [chosenLookML])

  return (
    <Box>
      <Box m='medium' width='30%'>
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
        {chosenLookML && (<>
        <Box m='medium' width='50%'>
        <Heading as='h3' mb='small'>2. Choose UDDs to sync</Heading>
          <SearchableUDDs/>
        </Box>
        <Box m='medium'>
          <Button>Sync</Button>
        </Box>
        </>)}
  </Box>
  )
}

const SyncDashBoards = () => {
  return (
    <></>
  )
}

const LoadingWrapper = (props) => {
  if (props.isLoading) {
    return <Space around p='xxxlarge'><Spinner size={80}/></Space>
  } else {
    return props.children
  }
}

const SyncAppInner = () => {
  const { core40SDK } = useContext(ExtensionContext)
  const { setDashData } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const processDashboards = (v) => {
      let tmp = {UDD: {}, LookML: {}}
      v.forEach(d => {
        if (isNaN(d.id)) {
          tmp.LookML[d.id] = d
        } else {
          tmp.UDD[d.id] = d
        }
      });
      setDashData(tmp)
    }

   const initialize = async () => {
      try {
        core40SDK.all_dashboards().then(v => {
          processDashboards(v.value);
          setIsLoading(false)
        })
      } catch (error) {
        console.error(error)
      }
    }
    initialize()
  
  }, [])

  return (
  <LoadingWrapper isLoading={isLoading}>
    <Box p='medium'>
    <Heading as='h1'>Create links</Heading>
      <CreateLinks/>
    </Box>
  </LoadingWrapper>
  )
}

export const SyncAppMain = () => {
  return (
    <ComponentsProvider>
    <AppContextProvider>
      <SyncAppInner/>
    </AppContextProvider>
      </ComponentsProvider>
  )
}

// 1. Create links
// 2. Sync
// 3. Find existing links (one API call per UDD! - for 'lookml_link_id')
