import styled from 'styled-components'
import { Box, Flex } from '@looker/components'

export const RoundedBox = styled(Box)`
    border: 1px solid #DEE1E5;
    border-radius: 4px ;
    padding: 20px;
    height: '80vh';
    `

export const FlexRowSpaceEven = styled(Flex)`
    flex-direction: ${props => props.small ? 'column' : 'row'};
    align-content: stretch;
    justify-content: space-evenly;
    height: 100%;
    flex-wrap: wrap;
`