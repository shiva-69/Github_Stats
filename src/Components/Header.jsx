import {Flex, Heading} from "@chakra-ui/react"

export const Header = () => {
    return <Flex align="center" justify="center" direction="column" color="#42413e">
        <Heading>GITHUB STATS</Heading>
        <Heading as='h3' size='lg' mb="30px">Most Starred Repos</Heading>
    </Flex>
}