import styled from 'styled-components'
import { Box, Flex } from '@looker/components'

export const RoundedBox = styled(Box)`
    border: 1px solid #DEE1E5;
    border-radius: 4px ;
    padding: 20px;
    max-height: 80vh;
    `

export const FlexRowSpaceEven = styled(Flex)`
    flex-direction: ${props => props.small ? 'column' : 'row'};
    align-content: stretch;
    justify-content: ${props => props.small ? 'flex-start' : 'space-evenly'};
    height: 100%;
`