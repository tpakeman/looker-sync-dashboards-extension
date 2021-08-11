import { Box, Label, Text } from '@looker/components'
import React, { useContext } from 'react'
import { RoundedBox } from './CommonComponents.js'
import { AppContext } from './AppContext'

export const LogContainer = () => {
    const { log } = useContext(AppContext)
    return (
        <RoundedBox minWidth='30vw'>
            <Label>Activity Log</Label>
            <Box overflowY='scroll' p='small'>
            <Text color='#939BA5' fontFamily='Roboto Mono, Monospace' lineHeight='16px' fontSize='16px'>{log.map((l, x) => <p key={x}>{l}</p>)}</Text>
        </Box>
            </RoundedBox>
    )
}