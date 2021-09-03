import { Box, Text } from '@looker/components'
import styled from 'styled-components'
import React from 'react'

export const InfoPage = () => {
    return (
        <Box mt='medium' height='60vh' overflowY='scroll'>
        <BlockText>It is possible to 'sync' user-defined dashboards (UDDs) with LookML dashboards.</BlockText>
          <BlockText>If changes are made to the LookML then the sync utility can push these changes to any linked UDDs.</BlockText>
          <BlockText>This provides a useful compromise: centrally managed dashboards that still live in normal folders.</BlockText>
          <br/>
          <BlockText>This is a 2 step process:</BlockText>
          <BlockText>1. Create a link between the UDD and the LookML dashboard</BlockText>
          <BlockText>2. Instruct the LookML dashboard to Sync, updating all of the dependent UDDs</BlockText>
          <br/>
          <BlockTextItalic><b>Note:</b> UDDs that were originally created by copying a LookML dashboard into a folder are linked automatically</BlockTextItalic>
        </Box>
    )
}

const BlockText = styled(Text)`
  display: block
`

const BlockTextItalic = styled(Text)`
  display: block;
  font-style: italic
`