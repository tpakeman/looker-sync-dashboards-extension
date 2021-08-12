import React, { useContext, useState } from 'react'
import { Flex, Menu, MenuItem, ButtonOutline, DividerVertical, Text, List, ListItem, Heading, Link, Box } from '@looker/components'
import { ChooseDashboards } from './ChooseDashboards'
import { AppContext } from './AppContext'
import { RoundedBox } from './CommonComponents'
import { ExtensionContext } from '@looker/extension-sdk-react'

const ShowLinks = (props) => {
    const { extensionSDK } = useContext(ExtensionContext)
    let info = undefined
    if (props.data) {
        info = (props.choice == 'UDD')
            ? [props.data.lookml_link_id]
            : props.data.linked
    }
    return (
        <RoundedBox minWidth='30vw'>
            <Heading p='small' variant='h6'>Linked Dashboards</Heading>
            { info 
            ? <List>
                {info.map((e, ix) => {
                    return <ListItem 
                                key={ix}
                                onClick={() => extensionSDK.openBrowserWindow(`/dashboards/${e}`, '_blank')}
                            >{e}</ListItem>
                })}
            </List>
            : <Text>No linked dashboards</Text>
        }
        </RoundedBox>
    )
}

export const ViewLinks = () => {
    const [choice, setChoice] = useState('UDD')
    const {dashData} = useContext(AppContext)
    const [selectedDash, setSelectedDash] = useState(undefined)

    const handleChoice = (e) => setChoice(e.target.innerText)
    return (
        <Flex flexDirection='column' justifyContent='space-around' m='medium'>
            <Menu
                content={
                <>
                    <MenuItem onClick={handleChoice}>UDD</MenuItem>
                    <MenuItem onClick={handleChoice}>LookML</MenuItem>
                </>
                }>
                <ButtonOutline width='10%'>{choice}</ButtonOutline>
                </Menu>
        <Flex flexDirection='row' m='medium' justifyContent='space-around'>
            <Box minWidth='30vw'>
                <ChooseDashboards UDD={choice == 'UDD'} data={dashData[choice]} heading={choice} Fn={setSelectedDash}/>
            </Box>
            <DividerVertical stretch/>
            <ShowLinks data={dashData[choice][selectedDash]} choice={choice}/>
        </Flex>
        </Flex>
    )
}