import React from "react";
import Chart from 'chart.js/auto';
import { Data } from "./data";
import { Line } from "react-chartjs-2";

const data = {
  labels: Data.map((item, i) => {
    if(i < 7){
        return item[0]
    }
  }),
  datasets: [
    {
      label: "Additions",
      data: Data.map((item, i) => {
        if(i < 7){
            return item[1]
        }
      }),
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)"
    },
    {
      label: "Deletions",
      data: Data.map((item, i) => {
        if(i < 7){
            return item[2]
        }
      }),
      fill: false,
      borderColor: "#742774"
    }
  ]
};

export const RepoDetails = () => {
  return (
      <div style={{width : "600px"}}>
        <Line data={data} />
      </div>
      
  );
}
