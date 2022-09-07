import React, { useState } from "react";
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";



export const RepoDetails = () => {
    const [error, setError] = React.useState(false);
    const [Data, setData] = React.useState([]);
    let repo = useSelector(state => state.add) ;
    console.log(repo);
    React.useEffect(()=> {
        fetch(repo)
        .then((res) => res.json())    
        .then((res) => setData(res));
        
    }, [])
    const data = {
        labels: Data && Data.slice(0,8).map((item, i) => { console.log(Data)
            let ms = item[0] * 1000;
            const dateObject = new Date(ms)
            console.log(dateObject)
            let month = dateObject.toLocaleString("en-US", {month: "long"}) // December
            let day = dateObject.toLocaleString("en-US", {day: "numeric"}) // 9
            let year =dateObject.toLocaleString("en-US", {year: "numeric"}) // 2019
            return `${day}-${month}-${year}`;
    }),
    datasets: [
        {
        label: "Additions",
        data: Data.slice(0,8).map((item, i) => {
                return item[1]
        }),
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
        },
        {
        label: "Deletions",
        data: Data.slice(0,8).map((item, i) => {
                return item[2]
        }),
        fill: false,
        borderColor: "#742774"
        }
    ]
    };
  return (
      <div style={{width : "60%"}}>
        <Line data={data} />
      </div>
      
  );
}
