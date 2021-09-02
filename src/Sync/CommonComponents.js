import styled from 'styled-components'
import { Box, Flex } from '@looker/components'

export const RoundedBox = styled(Box)`
    border: 1px solid #DEE1E5;
    border-radius: 4px ;
    padding: 20px;
    height: 80vh;
    `

export const FlexRowSpaceEven = styled(Flex)`
    flex-direction: row;
    justify-content: space-evenly;
    align-content: stretch;
    height: 100%
`