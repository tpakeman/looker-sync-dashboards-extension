import React, {  useState, createContext } from 'react'

export const AppContext = createContext()

export const AppContextProvider = (props) => {
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
