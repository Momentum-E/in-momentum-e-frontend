"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface UsageChartProps {
  Monthly_SOH_Data: number[];
}

export function BatteryHealthChart({Monthly_SOH_Data}: UsageChartProps): JSX.Element {
  console.log(Monthly_SOH_Data);
  const option: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    yaxis: {
      title: {
        text: "SOH",
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  };

  const series = [
    {
      name: "SOH",
      data: Monthly_SOH_Data,
    },
  ];

  return (
    <>
      <ApexChart
        type="area"
        options={option}
        series={series}
        height={300}
        width={700}
      />
    </>
  );
}
