import React, {  useContext, useState, createContext, useEffect } from 'react'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { initial } from 'lodash'
export const AppContext = createContext()

export const AppContextProvider = (props) => {
  const { core40SDK } = useContext(ExtensionContext)
  const [msg, setMsg] = useState({})
  const [log, setLog] = useState([])
  const [dashData, setDashData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const initialise = async () => { 
    try {
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
        let v = await core40SDK.all_dashboards()
        processDashboards(v.value, UDDMap, lookmlMap);
        setIsLoading(false)
      } catch (error) {
        setMsg('critical', error)
        console.error(error)
      }
    }
    initialise()
  }, [])

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
  
  const makeLinks = (UDDs, LookML) => {
    UDDs.forEach(d => {
      addLog(`Making link between ${d} and ${LookML}`)
      try {
        core40SDK.update_dashboard(d, {lookml_link_id: LookML}).then(r => {
          if (r.ok) {
            addLog(`Success for dashboard ${d}`)
          } else {
            addLog(`Failure for dashboard ${d}. Check console`)
            console.log(JSON.stringify(r))
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
          console.log(JSON.stringify(r))
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
  const clearLog = () => {setLog([])}
  const addLog = (m) => {
    let tmp = [...log]
    tmp.push(m)
    setLog(tmp)
  }

  const contextValue = {
    msg,
    log,
    addMsg,
    clearMsg,
    addLog,
    clearLog,
    dashData,
    setDashData,
    isLoading,
    makeLinks,
    syncLookMLDash
  }
  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  )
}
