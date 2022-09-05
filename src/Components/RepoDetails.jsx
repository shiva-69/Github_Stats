import React from "react";
import Chart from 'chart.js/auto';
import { Data } from "./data";
import { Line } from "react-chartjs-2";

const data = {
  labels: Data.map((item) => item[0]),
  datasets: [
    {
      label: "First dataset",
      data: Data.map((item) => item[1]),
      fill: false,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)"
    },
    {
      label: "Second dataset",
      data: Data.map((item) => item[2]),
      fill: false,
      borderColor: "#742774"
    }
  ]
};
console.log("labels: " ,data.labels);

export function RepoDetails() {
  return (
      <Line data={data} />
  );
}
