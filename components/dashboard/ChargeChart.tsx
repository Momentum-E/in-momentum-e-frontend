"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function ChargeChart() {
  const option: ApexCharts.ApexOptions = {
    chart: {
      height: 280,
      type: "radialBar",
    },
    colors: ["#20E647"],
    plotOptions: {
      radialBar: {
        startAngle: -135, 
        endAngle: 135,
        hollow: {
          margin: 10,
          size: "70%",
          background: "#293450",
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0,
          },
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: "#fff",
            fontSize: "14px",
          },
          value: {
            color: "#fff",
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        gradientToColors: ["#87D4F9"],
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Charge"],
  };

  const series = [100];

  return (
    <>
      <ApexChart
        type="radialBar"
        options={option}
        series={series}
        height={325}
        width={450}
      />
    </>
  );
}
