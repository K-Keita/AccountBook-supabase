import { Bar } from "react-chartjs-2";

type Props = {
  data: any;
};

// レンダリング
export const Graph = (props: Props): JSX.Element => {
  const options = {
    responsive: true,
    animation: {
      duration: 2000,
      // easing: "easeInBounce",
    },
    plugins: {
      //タイトル関連
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
      //x軸関連
      x: {
        grid: {
          drawBorder: true,
          color: "#fff", //borderの色
        },
        ticks: {
          color: "#fff", //テキストの色
          font: {
            size: 12,
          },
        },
      },
      //y軸関連
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

  return <Bar data={props.data} options={options} />;
};
