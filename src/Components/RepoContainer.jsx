import {  Heading, Spinner, Flex, Select } from "@chakra-ui/react";
import React from "react";
import { RepoCard } from "./RepoCard";


export const RepoContainer = () => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [date, setDate] = React.useState("2022-09-01");
    const ModifiedDate = ( year, month, day) =>{
        return new Date(
            new Date().getFullYear() - year,
            new Date().getMonth() - month , 
            new Date().getDate() - day
        );        
    }
    
    const handleChange = (e) => {
        if(e.target.value == "1week"){
            let newDate = ModifiedDate(0, 0, 7)
            let month = newDate.getMonth();
            month = month.toString();
            if(month.length == 1){
                month = "0" + month
                console.log(month)
            }
            let day = newDate.getDate();
            day = day.toString();
            if(day.length == 1){
                day = "0" + day
                console.log(day)
            }
            setDate(`${newDate.getFullYear()}-${month}-${day}`);
        }
        else if(e.target.value == "2week"){
            let newDate = ModifiedDate(0, 0, 14)
            let month = newDate.getMonth();
            month = month.toString();
            if(month.length == 1){
                month = "0" + month
                console.log(month)
            }
            let day = newDate.getDate();
            day = day.toString();
            if(day.length == 1){
                day = "0" + day
                console.log(day)
            }
            setDate(`${newDate.getFullYear()}-${month}-${day}`);
        }
        else if(e.target.value == "1month"){
            let newDate = ModifiedDate(0, 1, 0)
            let month = newDate.getMonth();
            month = month.toString();
            if(month.length == 1){
                month = "0" + month
                console.log(month)
            }
            let day = newDate.getDate();
            day = day.toString();
            if(day.length == 1){
                day = "0" + day
                console.log(day)
            }
            setDate(`${newDate.getFullYear()}-${month}-${day}`);
        }
        else if(e.target.value == "6month"){
            let newDate = ModifiedDate(0, 6, 0)
            let month = newDate.getMonth();
            month = month.toString();
            if(month.length == 1){
                month = "0" + month
                console.log(month)
            }
            let day = newDate.getDate();
            day = day.toString();
            if(day.length == 1){
                day = "0" + day
                console.log(day)
            }
            setDate(`${newDate.getFullYear()}-${month}-${day}`);
        }
        else if(e.target.value == "1year"){
            let newDate = ModifiedDate(1, 0, 0)
            let month = newDate.getMonth();
            month = month.toString();
            if(month.length == 1){
                month = "0" + month
                console.log(month)
            }
            let day = newDate.getDate();
            day = day.toString();
            if(day.length == 1){
                day = "0" + day
                console.log(day)
            }
            setDate(`${newDate.getFullYear()}-${month}-${day}`);
        }
    }
    React.useEffect(()=>{
        setLoading(true)
        fetch(`https://api.github.com/search/repositories?q=created:>${date}&sort=stars&order=desc`)
        .then((res) => res.json())
        .then((res) => {
            setData(res.items)
        })
        .catch((err) => setError(true))
        .finally(() => setLoading(false))
    }, [date])
    return <> 
    <Flex justify="center" align="center" gap="1%">
        <Heading as='h5' size='sm'> Select Time</Heading> 
        <Select  w="150px" onChange={handleChange} placeholder="Select an option">
            <option value='1week'>1 week</option>
            <option value='2week'>2 week</option>
            <option value='1month'>1 month</option>
            <option value='6month'>6 month</option>
            <option value='1year'>1 Year</option>
        </Select>
    </Flex>
        {
            loading ? <Flex align="center" justify="center" mt="200px"><Spinner size='xl'/></Flex> : error ? <Heading/> : data.map((item) => (
                <RepoCard data={item} key={item.id}/>
            ))
        }
    </>
}