import { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";

type Props = {
  labels: string[];
  arr: number[] | undefined;
};

// レンダリング
export const Graph = (props: Props): JSX.Element => {
  const [selectChart, setSelectChart] = useState<"Pie" | "Bar">("Pie");

  const changeChart = (chart: "Pie" | "Bar") => {
    if (selectChart === chart) {
      return;
    }
    setSelectChart(chart);
  };

  const data = {
    labels: props.labels,
    datasets: [
      {
        responsive: true,
        label: "Category",
        ticks: {
          beginAtZero: true,
          fontColor: "white",
        },
        data: props.arr,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsBar = {
    responsive: true,
    animation: {
      duration: 2500,
    },
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          drawBorder: true,
          color: "rgb(255, 255, 255, 0.3)",
        },
        ticks: {
          color: "#fff",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          drawBorder: true,
          color: "rgb(255, 255, 255, 0.3)",
        },
        ticks: {
          color: "#fff",
          font: {
            size: 12,
          },
          beginAtZero: true,
        },
      },
    },
  };

  const optionsPie = {
    responsive: true,
    animation: {
      duration: 2000,
      // delay: 1000,
    },
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: {
            size: 10,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          drawBorder: true,
          color: "rgba(0,0,0,0)",
        },
        ticks: {
          color: "#fff",
          font: {
            size: 0,
          },
        },
      },
      y: {
        grid: {
          drawBorder: true,
          color: "rgba(0,0,0,0)",
        },
        ticks: {
          color: "#fff",
          font: {
            size: 0,
          },
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <>
      <div className="flex justify-around mb-4 text-xl sm:mt-3 sm:text-lg">
        <button
          className={`px-2 py-1 ${
            selectChart === "Pie" ? "bg-flower bg-opacity-50" : ""
          }`}
          onClick={() => {
            changeChart("Pie");
          }}
        >
          Pie Chart
        </button>
        <button
          className={`px-2 py-1 ${
            selectChart === "Bar" ? "bg-flower bg-opacity-50" : ""
          }`}
          onClick={() => {
            changeChart("Bar");
          }}
        >
          Bar Chart
        </button>
      </div>
      <div className="h-80">
        {selectChart === "Pie" ? (
          <div className="p-2 mx-auto max-w-2xl">
            <Pie data={data} options={optionsPie} />
          </div>
        ) : (
          <div className="pt-6 mx-auto max-w-2xl">
            <Bar height={240} data={data} options={optionsBar} />
          </div>
        )}
      </div>
    </>
  );
};
