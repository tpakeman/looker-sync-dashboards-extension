import { Box, Heading, Text } from '@looker/components'
import React, { useContext } from 'react'
import { RoundedBox } from './CommonComponents.js'
import { AppContext } from './AppContext'

export const LogContainer = () => {
    const { log } = useContext(AppContext)
    return (
        <RoundedBox>
            <Heading as='h5' p='medium'>Activity Log</Heading>
            <Box overflowY='scroll' p='small'>
            <Text color='#939BA5' fontFamily='Roboto Mono, Monospace' lineHeight='16px' fontSize='16px'>{log.map((l, x) => <p key={x}>{l}</p>)}</Text>
        </Box>
            </RoundedBox>
    )
}