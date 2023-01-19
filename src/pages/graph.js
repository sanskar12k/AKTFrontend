import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Title,
  BarElement,
  Legend
} from "chart.js";
import './graph.css'
// defaults.global.maintainAspectRatio = false
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Graph = ({ydata, xdata, param}) => {
    // console.log(ydata)
  const data = {
    labels: [...xdata],
    datasets: [
      {
        data: [...ydata],
        label:param,
        // backgroundColor: "transparent",
        // borderColor: "#f26c6d",
        // pointBorderColor: "transparent",
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderWidth: 8,
        tension: 0.1,
      },
    ],
  };

  const options = {
    maintainAspectRatio : false,
    plugins: {
      legend: true
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          stepSize: 8,
        //   callback: (value) =>  + value,
        },
        grid: {
          borderDash: [10],
        },
      },
    },
  };
  return (
    <div className="graph" >
      {/* // <div> */}
      <Bar data={data} options={options}></Bar>
      
    </div>
  );
};

export default Graph;
