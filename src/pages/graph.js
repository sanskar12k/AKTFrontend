import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  BarElement,
  Legend
} from "chart.js";
import './graph.css'
// defaults.global.maintainAspectRatio = false
ChartJS.register(BarElement,  LinearScale, CategoryScale, Title, Tooltip);

const Graph = ({ydata, xdata, param}) => {
    // console.log(ydata)
  const data = {
    labels: [...xdata],
    datasets: [
      {
        data: [...ydata],
        label:param,
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
        display:false
      },
      y: {
        // ticks: {
        //   stepSize: 20,
        // },
        grid: {
          borderDash: [15],
        },
      },
    },
  };
  return (
    <div className="graph" >
      <Bar data={data} options={options}></Bar>
    </div>
  );
};

export default Graph;
