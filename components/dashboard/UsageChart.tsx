"use client"; // if you use app dir, don't forget this line

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function UsageChart() {
  const option: ApexCharts.ApexOptions = {
    annotations: {
      points: [
        {
          x: "distance",
          seriesIndex: 0,
          label: {
            borderColor: "#775DD0",
            offsetY: 0,
            style: {
              color: "#fff",
              background: "#775DD0",
            },
            text: "distance",
          },
        },
      ],
    },
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
    },

    grid: {
      row: {
        colors: ["#fff", "#f2f2f2"],
      },
    },
    xaxis: {
      labels: {
        rotate: -45,
      },
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
      tickPlacement: "on",
    },
    yaxis: {
      title: {
        text: "Avg distance in km",
      },
      max: 100
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
  };

  const series = [
    {
      name: "Avg distance in km",
      data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65],
    },
  ];

  return (
    <>
      <ApexChart
        type="bar"
        options={option}
        series={series}
        height={260}
        width={700}
      />
    </>
  );
}
