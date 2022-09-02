import {  Heading, Spinner, Flex, Select } from "@chakra-ui/react";
import React from "react";
import { RepoCard } from "./RepoCard";


export const RepoContainer = () => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    React.useEffect(()=>{
        fetch("https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc")
        .then((res) => res.json())
        .then((res) => {
            setData(res.items)
            setLoading(false);
        })
        .catch((err) => setError(true));
    }, [])
    return <> 
    <Flex justify="center" align="center" gap="1%">
        <Heading as='h5' size='sm'> Select Time</Heading> 
        <Select placeholder='Select option' w="100px">
            <option value='option1'>Option 1</option>
            <option value='option2'>Option 2</option>
            <option value='option3'>Option 3</option>
        </Select>
    </Flex>
        {
            loading ? <Flex align="center" justify="center" mt="200px"><Spinner size='xl'/></Flex> : error ? <Heading/> : data.map((item) => (
                <RepoCard data={item} key={item.id}/>
            ))
        }
    </>
}