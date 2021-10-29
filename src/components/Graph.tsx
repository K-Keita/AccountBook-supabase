import { Bar, Pie } from "react-chartjs-2";

type Props = {
  labels: string[];
  arr: number[] | undefined;
};

// レンダリング
export const Graph = (props: Props): JSX.Element => {
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

  const options = {
    responsive: true,
    animation: {
      duration: 2000,
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
          color: "#fff",
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
          color: "#fff",
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
      <div className="flex text-2xl">
        <h2 className="">Bar Chart</h2>
        <h2 className="">Pie Chart</h2>
      </div>
      <Bar data={data} options={options} />
      <div className="p-5">
        <Pie data={data} options={optionsPie} />
      </div>
    </>
  );
};
