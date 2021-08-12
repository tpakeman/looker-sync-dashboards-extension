import React, {  useState, useContext } from 'react'
import { AppContext } from './AppContext.js'
import { Flex, Heading, InputSearch,MenuList, MenuItem, Panels, Panel, List, ListItem, Text, ButtonOutline, Icon, Divider} from '@looker/components'
import { RoundedBox } from './CommonComponents.js'
import { isEmpty } from 'lodash'
import { Reports } from '@looker/icons'

// TODO
// Add icons based for personal and shared folders
// UDD browser cannot handle nesting properly - need a different approach.


export const ChooseDashboards = (props) => {
    const defaultDash = props.UDD ? [] : undefined
    const { addMsg } = useContext(AppContext)
    const [selectedDash, setSelectedDash] = useState(defaultDash)
    const [searchText, setSearchText] = useState('')

    const clearAll = () => {
      setSelectedDash(defaultDash)
    }

    const handleClick = (e) => {
        let tmp = e
        if (props.multi) {
            if (selectedDash.includes(e)) {
                tmp = selectedDash.filter(v => v !== e)
            } else {
                tmp = [...selectedDash, e]
            }
            tmp = tmp.filter((v, i, s) => s.indexOf(v) == i)
        } 
        setSelectedDash(tmp)
        props.Fn(tmp)
      }
    

      const getOptions = () => {
        if (isEmpty(props.data)) {
            addMsg('inform', 'No dashboards found')
            return []
        }
        let categories = Object.values(props.data)
        if (props.UDD) {
          categories = categories
            .map((v) => v.folder.name)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort((a, b) => a-b)
            .map(e => ({
              label: e,
              options: Object.values(props.data)
                .filter(v => v.folder.name == e)
                .map(v=> ({label: v.title, value: v.id}))
            }))
        } else {
          categories = categories
            .map((v) => v.model.id)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort((a, b) => a-b)
                .map(e => ({
                  label: e,
                  options: Object.values(props.data)
                    .filter(v => v.model.id == e)
                    .map(v=> ({label: v.title, value: v.id, 'model': v.model.id}))
                }))
        }

        return searchText === '' 
        ? categories
        : categories
          .filter(o => o.options.filter(e => e.label.toLowerCase().includes(searchText.toLowerCase())).length > 0)
      }
    
    return (
        <RoundedBox style={{width: '100%', height: '100%', overflowX:'hidden'}}>
          <Flex flexDirection='column' justifyContent='space-between' alignContent='stretch' height='100%'>
          <Heading as='h3' mb='small'>{props.heading}</Heading>
          <InputSearch
            placeholder='Search by Dashboard Name'
            value={searchText}
            onChange={setSearchText}
            marginBottom='small'
          />
          <Panels>
            <List iconGutter={props.UDD} style={{margin:'auto'}}>
              <Text>{props.UDD ? 'Folders' : 'Models'}</Text>
              {getOptions().map((e, ix) => {
                return (<Panel
                  title={e.label}
                  key={ix}
                  direction='right'
                  content={
                  <MenuList style={{height: '80%', overflowY: 'scroll'}}>
                    {e.options.map((o, ix2) => {
                    let isMatch = props.multi ? selectedDash.includes(o.value) : selectedDash == o.value;
                    return (
                    <MenuItem
                      key={ix2}
                      onClick={() => handleClick(o.value)}
                      style={{
                        backgroundColor: isMatch ? 'rgba(108, 67, 224, 0.2)': '',
                        // border: isMatch ? '1px solid rgb(108, 67, 224)' : '',
                        // borderRadius: isMatch ? '4px' : ''
                        // color: isMatch ? '#ffffff': ''
                      }}
                      detail={o.value}
                    >
                      {o.label}
                    </MenuItem>
                      )
                  })}
                    </MenuList>}>
                <ListItem > {e.label}</ListItem></Panel> )}
                // <ListItem icon={<Reports />}> {e.label}</ListItem></Panel> )}
                )}
            </List>
          </Panels>
            <Divider stretch/>
            <Flex width='100%' flexDirection='row' alignSelf='flex-end' justifyContent='space-between' mt='small'>
            <Text>{`${props.multi ? selectedDash.length: (isEmpty(selectedDash) ? '0' : '1')} selected`}</Text>
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
