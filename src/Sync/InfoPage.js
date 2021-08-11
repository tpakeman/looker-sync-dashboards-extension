import { Box, Text } from '@looker/components'
import React from 'react'

export const InfoPage = () => {
    return (
        <Box m='medium'>
        <Text style={{display:'block'}}>It is possible to 'sync' 'user defined dashboards' (UDDs) with LookML dashboards.</Text>
          <Text style={{display:'block'}}>You make changes to the LookML and then use 'sync' to push changes to UDDs reflect these changes.</Text>
          <br/>
          <Text style={{display:'block'}}>This is a 2 step process:</Text>
          <Text style={{display:'block'}}>1. Create a link between the UDD and the LookML dashboard</Text>
          <Text style={{display:'block'}}>2. Instruct the LookML dashboard to 'Sync', updating all of the dependent UDDs</Text>
          <br/>
          <Text style={{display:'block', fontStyle: 'italic'}}>Note that UDDs created from LookML dashboards will be linked automatically</Text>
        </Box>
    )
}
