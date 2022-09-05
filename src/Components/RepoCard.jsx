import { ArrowForwardIcon, ExternalLinkIcon} from "@chakra-ui/icons"
import { Box, Flex, Heading, Image, Badge, Link} from "@chakra-ui/react"
import { useDispatch } from "react-redux"
import { addRepo } from "../Redux/Repo/Actions";
import {useNavigate} from "react-router-dom";


export const RepoCard = ({data}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleDate = (str) => {
        let ans = "";
        for(let i = 0; i < str.length; i++){
            if(str[i] != "T"){
                ans += str[i];
            }
            else if(str[i] == "T"){
                break;
            }
        }
        return ans;
    }
    const handleClick = (info) => {
        const link = `https://api.github.com/repos/${info}/stats/code_frequency`;
        dispatch(addRepo(link));
        navigate("/repo_details")
    }

    return <Flex ml="10%" mr="10%" boxShadow='2xl' p='6' rounded='md' bg='white' mb="1%" >
        <Image src={data.owner.avatar_url} boxSize='150px' objectFit='cover'/>
        <Flex direction="column" grow="3" pl="3%">
            <Heading as='h4' size='md' mb="1%">{data.name} <Badge>{data.private ? "Private" : "Public"}</Badge></Heading> 
            <Box mb="1%">{ data.description ? data.description: <>No Description </>}</Box>
            <Flex gap="5%" mb="1%">
                <Box>Stars : <b>{data.stargazers_count}</b></Box>
                <Box>Issues : <b>{data.open_issues}</b></Box>
            </Flex>
            
            <Flex gap="5%">
                <Box>Last pushed at {handleDate(data.pushed_at)} by {data.owner.login}</Box>
                <Link href={data.html_url} isExternal> View On Github <ExternalLinkIcon mx='2px' /></Link>
            </Flex>
        </Flex>
            <Flex justify="center" align="center" onClick={() => handleClick(data.full_name)}> <ArrowForwardIcon w={8} h={8} cursor="pointer"/></Flex>
    </Flex>
}

