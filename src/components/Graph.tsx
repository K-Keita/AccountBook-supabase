import { useEffect } from "react";
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

  // const options = {
  //   responsive: true,
  //   // maintainAspectRatio: true,
  //   color: "white",
  //   legend: {
  //     labels: {
  //       fontColor: "orange",
  //     },
  //   },
  //   title: {
  //     display: true,
  //     fontColor: "blue",
  //     text: "Custom Chart Title",
  //   },
  //   animation: {
  //     duration: 2000,
  //     // easing: "easeInBounce",
  //   },
  //   scales: {
  //     yAxes: {
  //       grid: {
  //         drawBorder: true,
  //         color: "#fff",
  //       },
  //       // ticks: {
  //       //   beginAtZero: false,
  //       //   fontColor: "red",
  //       // },
  //     },
  //     xAxes: {
  //       grid: {
  //         drawBorder: true,
  //         color: "#fff",
  //       },
  //       // ticks: {
  //       //   fontColor: "blue",
  //       //   beginAtZero: false,
  //       // },
  //     },
  //   },
  // };

  return <Bar data={props.data} options={options} />;
};
