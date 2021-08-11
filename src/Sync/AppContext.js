import React, {  useContext, useState, createContext, useEffect } from 'react'
import { ExtensionContext } from '@looker/extension-sdk-react'
export const AppContext = createContext()

export const AppContextProvider = (props) => {
  const { core40SDK } = useContext(ExtensionContext)
  const [msg, setMsg] = useState({})
  const [log, setLog] = useState([])
  const [dashData, setDashData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
      try {
        core40SDK.all_dashboards().then(v => {
          processDashboards(v.value);
          setIsLoading(false)
        })
      } catch (error) {
        setMsg('critical', error)
        console.error(error)
      }
  }, [])

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
