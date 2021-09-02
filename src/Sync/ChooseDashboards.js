import React, {  useState, useContext } from 'react'
import { AppContext } from './AppContext.js'
import { Flex, Heading, InputSearch,ListItem, Text, ButtonOutline, Tooltip, Divider, TreeCollection, Tree, TreeItem, RadioGroup} from '@looker/components'
import { RoundedBox } from './CommonComponents.js'
import { isEmpty } from 'lodash'
import { Person, Folder, Dashboard, NoteAlt } from '@styled-icons/material-outlined'
const MATCHCOLOR = 'rgba(108, 67, 224, 0.2)'

export const ChooseLookMLDashboards = (props) => {
    const defaultDash = undefined
    const { addMsg } = useContext(AppContext)
    const [selectedDash, setSelectedDash] = useState(defaultDash)
    const [searchText, setSearchText] = useState('')

    const clearAll = () => {
      setSelectedDash(defaultDash)
    }

    const handleClick = (e) => {
        setSelectedDash(e)
        props.Fn(e)
      }


      const generateTree = () => {
        console.log(props.data)
        if (isEmpty(props.data)) {
            addMsg('inform', 'No LookML dashboards found')
            return []
        }

        let reshaped = Object.values(props.data).reduce((acc, cur) => {
          if (Object.keys(acc).includes(cur.model.id)) {
            acc[cur.model.id].dashboards.push(cur)
          } else {
            acc[cur.model.id] = {label: cur.model.label, dashboards: [cur]}
          }
          return acc
        }, {})


        return (Object.values(reshaped).map((m, ix) => {
          let inactive = m.dashboards.filter(d2 => d2.title.toLowerCase().includes(searchText.toLowerCase())).length == 0
          return (
            <>
            {inactive
            ? <Tooltip content='Empty folder' placement='right'><ListItem key={ix} style={{marginLeft:'8px'}} icon={<NoteAlt/>} disabled>{m.label}</ListItem></Tooltip> 
            :
              <Tree icon={<NoteAlt/>} key={ix} label={m.label} >
                {m.dashboards.map((d, ix2) => {
                  let isMatch = selectedDash == d.id
                  if (searchText === '' || d.title.toLowerCase().includes(searchText.toLowerCase())) {
                  return <TreeItem 
                  // detail={d.id}
                   key={ix2}  icon={<Dashboard/>} onClick={() => handleClick(d.id)} style={{backgroundColor: isMatch ? MATCHCOLOR: ''}}>{d.title}</TreeItem>
                }
                })}
              </Tree>
        } </>
            )
        })
    )
  }
    
    return (
        <RoundedBox>
          <Flex flexDirection='column' height='calc(100% - 50px)' overflowY='scroll'>
          <Heading as='h3' mb='small'>{props.heading}</Heading>
          <InputSearch
            placeholder='Search by Dashboard Name'
            value={searchText}
            onChange={setSearchText}
            marginBottom='small'
          />
          <TreeCollection>
            {generateTree()}
          </TreeCollection>
            <Divider stretch/>
            <Flex height='50px' width='100%' flexDirection='row' alignSelf='flex-end' justifyContent='space-between' mt='small'>
            <Text>{`${isEmpty(selectedDash) ? '0' : '1'} selected`}</Text>
              <ButtonOutline
                size='xsmall'
                color='critical'
                marginBottom='medium'
                onClick={clearAll}
                disabled={isEmpty(selectedDash)}
              >Clear</ButtonOutline>
            </Flex>
            </Flex>
        </RoundedBox>
      )
}

export const ChooseUDDs = (props) => {
  const defaultDash = []
    const { addMsg, folderData } = useContext(AppContext)
    const [selectedDash, setSelectedDash] = useState(defaultDash)
    const [searchText, setSearchText] = useState('')
    const [folderType, setFolderType] = useState('shared')
    
    const handleClick = (e) => {
      let tmp
      if (selectedDash.includes(e)) {
        tmp = selectedDash.filter(v => v !== e)
      } else {
        tmp = [...selectedDash, e]
      }
      tmp = tmp.filter((v, i, s) => s.indexOf(v) == i)
      setSelectedDash(tmp)
      props.Fn(tmp)
    }

    const clearAll = () => {
      setSelectedDash(defaultDash)
    }
    

    const produceTree = (data) => {
      let tmp = Array.isArray(data) ? data : [data]
        return (
          tmp.map((d, ix) => {
            let child = Array.isArray(d.children) ? d.children : [d.children]
            let dash = Array.isArray(d.dashboards) ? d.dashboards : [d.dashboards]
            let inactive = (d.dashboards.filter(d2 => d2.title.toLowerCase().includes(searchText.toLowerCase())).length + d.children.length) == 0 
            let icon = d.is_personal ? <Person/> : <Folder/>
            return (
              <>
              {inactive? <Tooltip content='Empty folder' placement='right'><ListItem key={ix} style={{marginLeft:'8px'}} icon={icon} disabled>{d.name}</ListItem></Tooltip> : <Tree
                icon={icon}
                key={ix}
                label={d.name}
                detail={d.id}
              >
                {child.map(c => {return produceTree(c)})}
                {dash.map((d2, ix) => {
                  let isMatch = selectedDash.includes(d2.id)
                  if (searchText === '' || d2.title.toLowerCase().includes(searchText.toLowerCase())) {
                  return (
                    <TreeItem
                      key={ix}
                      onClick={() => handleClick(d2.id)}
                      style={{backgroundColor: isMatch ? MATCHCOLOR: ''}}
                      detail={d2.id}
                    >
                      {d2.title}
                    </TreeItem>
                  ) 
                }
                })}
              </Tree>}
              </>
            )
          })
        )
    }
  
      const generateDashTree = () => {
        let data = folderData[folderType]
        if (folderType == 'shared' || folderType == 'personal') {
          data = data[0].children
        }
        return produceTree(data)
      }

  const chooseFolderType = (e) => setFolderType(e)

  return (
    <RoundedBox>
      <Flex flexDirection='column' height='calc(100% - 50px)' overflowY='scroll'>
      <Heading as='h3' mb='small'>{props.heading}</Heading>
      <Flex flexDirection='row'>
        <RadioGroup inline
          value={folderType}
          onChange={chooseFolderType}
          options={[{value: 'shared', label: 'Shared'}, {value: 'personal', label: 'Personal'}, {value: 'embed', label: 'Embed'}]}
        />
      </Flex>
      <InputSearch
            placeholder='Search by UDD Name'
            value={searchText}
            onChange={setSearchText}
            marginBottom='small'
      />
      <TreeCollection height='100%' overflowy='scroll'>
      {generateDashTree()}
      </TreeCollection>
    </Flex>
    <Divider stretch/>
            <Flex height='50px' width='100%' flexDirection='row' alignSelf='flex-end' justifyContent='space-between' mt='small'>
            <Text>{`${selectedDash.length} selected`}</Text>
              <ButtonOutline
                size='xsmall'
                color='critical'
                marginBottom='medium'
                onClick={clearAll}
                disabled={isEmpty(selectedDash)}
              >Clear</ButtonOutline>
            </Flex>
  </RoundedBox>
  )
}

