"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function BatteryHealthChart() {
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
      data: [100, 100, 99.98, 99.94, 99.91, 99.88, 99.85, 99.7, 99.68, 99.63, 99.6, 99.6],
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
