import React, {  useContext, useState, useReducer, createContext, useEffect } from 'react'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { useMediaQuery } from 'react-responsive'
export const AppContext = createContext()

export const AppContextProvider = (props) => {
  const { core40SDK } = useContext(ExtensionContext)
  const [msg, setMsg] = useState({})
  const [log, addLog] = useReducer((cur, m) => {cur.unshift(m);  return cur}, [])
  const [rawDashData, setRawDashData] = useState({})
  const [dashData, setDashData] = useState({})
  const [folderData, setFolderData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const initialise = async () => { 
    try {
        let [UDDMap, lookmlMap] = await fetchLinks()
        let v = await core40SDK.all_dashboards()
        setRawDashData(v.value)
        processDashboards(v.value, UDDMap, lookmlMap);
        let v2 = await core40SDK.all_folders('name, id, parent_id,is_embed,is_embed_shared_root,is_embed_users_root,is_personal,is_personal_descendant,is_shared_root,is_users_root')
        processFolders(v2.value, v.value);
        setIsLoading(false)
      } catch (error) {
        setMsg('critical', error)
        console.error(error)
      }
    }
    initialise()
  }, [])

  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  const fetchLinks = async () => {
    let r = await core40SDK.search_dashboards('id,lookml_link_id')
    let data = r.value
      .map(v => ({id: v.id, lookml_link_id: v.lookml_link_id}))
      .filter(v => v.lookml_link_id)
    let UDDMap = data.reduce((acc, cur) => {
        acc[cur.id] = cur.lookml_link_id
        return acc
      }, {})
    let lookmlMap = data.reduce((acc, cur) => {
        if (cur.lookml_link_id in acc) {
          acc[cur.lookml_link_id].push(cur.id)
        } else {
          acc[cur.lookml_link_id] = [cur.id]
        }
        return acc
      }, {})
    return [UDDMap, lookmlMap]
  }

  const remapLinks = async () => {
    let [UDDMap, lookmlMap] = await fetchLinks()
    processDashboards(rawDashData, UDDMap, lookmlMap);
  }

  const processDashboards = (v, UDDMap, lookmlMap) => {
    let tmp = {UDD: {}, LookML: {}}
    v.forEach(d => {
      if (isNaN(d.id)) {
        d.linked = d.id in lookmlMap ? lookmlMap[d.id] : []
        tmp.LookML[d.id] = d
      } else {
        d.lookml_link_id = String(d.id) in UDDMap ? UDDMap[d.id] : null
        tmp.UDD[d.id] = d
      }
    });
    setDashData(tmp)
  }
  
  const reduceFolders = (inArray, fullArray=null, dashData) => {
    let allItems = fullArray ? fullArray : inArray
    let target = Array.from(fullArray ? inArray : inArray.filter(f => !f.parent_id))
    target.forEach(f => {
      let children = allItems.filter(item => item.parent_id == f.id)
      f.dashboards = dashData.filter(d => d.folder.id == f.id)
      f.children = children.length == 0 ? [] : reduceFolders(children, allItems, dashData)
    })
    return target
  }

  const processFolders = (v, dashData) => {
    let shared = v.filter(f => (f.is_shared_root || !(f.is_users_root || f.is_personal || f.is_personal_descendant || f.is_embed)) && f.id !== 'lookml')
    let personal = v.filter(f => (f.is_users_root || f.is_personal || f.is_personal_descendant))
    let embed = v.filter(f => f.is_embed)
    
    let data = {
      shared: reduceFolders(shared, null, dashData),
      personal: reduceFolders(personal, null, dashData),
      embed: reduceFolders(embed, null, dashData)
    }
    setFolderData(data)
  }

  const makeLinks = (UDDs, LookML) => {
    UDDs.forEach(d => {
      addLog(`Making link between ${d} and ${LookML}`)
      try {
        core40SDK.update_dashboard(d, {lookml_link_id: LookML}).then(r => {
          if (r.ok) {
            addLog(`Success for dashboard ${d}`)
          } else {
            addLog(`Failure for dashboard ${d}. Check console`)
          }
        })
      } catch (e) {
        console.error(e)
        addLog(`ERROR! ${e}`)
        addMsg('critical', e)
      }
    })
  }

  const removeLinks = (UDDs) => {
    UDDs.forEach(d => {
      addLog(`Removing lookml_link_ids for ${d}`)
      try {
        core40SDK.update_dashboard(d, {lookml_link_id: ''}).then(r => {
          if (r.ok) {
            addLog(`Success for dashboard ${d}`)
          } else {
            addLog(`Failure for dashboard ${d}. Check console`)
          }
        })
      } catch (e) {
        console.error(e)
        addLog(`ERROR! ${e}`)
        addMsg('critical', e)
      }
    })
  }

  const syncLookMLDash = (LookML) => {
    try {
        addLog(`Syncing LookML Dashboard ${LookML}`)
        core40SDK.sync_lookml_dashboard(LookML).then(r => {
        if (r.ok) {
          addLog(`Success for ${LookML}`)
        } else {
          addLog(`Failure for ${LookML}. Check console`)
        }
      })
    } catch (e) {
      console.error(e)
      addLog(`ERROR! ${e}`)
      addMsg('critical', e)
    }
  }

  const clearMsg = () => {setMsg({})}
  // intent = 'critical', 'inform', 'positive'
  const addMsg = (intent, msg) => {setMsg({intent:intent, msg:msg})}

  const contextValue = {
    msg,
    log,
    addMsg,
    clearMsg,
    addLog,
    dashData,
    setDashData,
    folderData,
    isLoading,
    makeLinks,
    syncLookMLDash,
    remapLinks,
    removeLinks,
    isBigScreen,
    isTabletOrMobile
  }
  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  )
}
