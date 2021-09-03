import { Box, Heading, Text } from '@looker/components'
import React, { useContext } from 'react'
import { RoundedBox } from './CommonComponents.js'
import { AppContext } from './AppContext'

const prettyText = (t) => {
    let [msg, type] = [...t]
    let re, parts
    let [d, m] = [...msg.split(' ::')]
    let output = [['#073b4c',d]]
    switch(type) {
        case 'action':
            if (m.startsWith('Making')) {
                re = /(Making link between )(\d*)( and )(.*)/
                parts = m.match(re)
                output.push(['#939BA5',parts[1]])
                output.push(['#118ab2',parts[2]])
                output.push(['#073b4c',parts[3]])
                output.push(['#118ab2',parts[4]])
            } else if (m.startsWith('Removing')) {
                re = /(Removing lookml_link_ids for dashboard )(\d*)/
                parts = m.match(re)
                output.push(['#939BA5',parts[1]])
                output.push(['#118ab2',parts[2]])
            } else if (m.startsWith('Syncing')) {
                re = /(Syncing LookML Dashboard )(.*)/
                parts = m.match(re)
                output.push(['#939BA5',parts[1]])
                output.push(['#118ab2',parts[2]])
            }
             else {
                output.push(['#939BA5',m])
             }
          break;
        case 'status':
            if (m.startsWith('Success')) {
                re = /(Success for dashboard )(.*)/
                parts = m.match(re)
                output.push(['#939BA5',parts[1]])
                output.push(['#118ab2',parts[2]])
            } else if (m.startsWith('Failure')) {
                re = /(Failure for dashboard )(.*)(\. Check console)/
                parts = m.match(re)
                output.push(['#939BA5',parts[1]])
                output.push(['#118ab2',parts[2]])
                output.push(['#939BA5',parts[3]])
            } else {
                output.push(['#939BA5',m])
            }
          break;
        case 'error':
            <span fontStyle='bold' fontColor='#ef476f'>{m}</span>
            break;
          default:
            output.push(['#939BA5',m])
        }
    return (
        <>
            {output.map((l, ix) => {
                console.log(l)
            return (
                <Text key={ix} color={l[0]} fontFamily='Roboto Mono, Monospace' lineHeight='14px' fontSize='14px'>
                    {l[1]}
                </Text>
                )
                }
                )}
        </>
        )
}

export const LogContainer = () => {
    const { log } = useContext(AppContext)
    return (
        <RoundedBox>
            <Heading as='h5' p='medium'>Activity Log</Heading>
            <Box p='small' height='60vh' overflowY='scroll'>
                {log.map((l, x) => <p key={x}>{prettyText(l)}</p>)}
        </Box>
            </RoundedBox>
    )
}