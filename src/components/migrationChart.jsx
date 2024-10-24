import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Context } from "../store/appContext";

// Registrar los elementos necesarios
Chart.register(ArcElement, Tooltip, Legend);

const MigrationChart = () => {
  const { store } = useContext(Context);

  const migrationStatusCounts = {
    ordered: 0,
    inProgress: 0,
    completed: 0,
  };

  store.migrations.forEach((migration) => {
    if (migration.migration_status === "Ordered") {
      migrationStatusCounts.ordered++;
    } else if (migration.migration_status === "In progress") {
      migrationStatusCounts.inProgress++;
    } else if (migration.migration_status === "Completed") {
      migrationStatusCounts.completed++;
    }
  });

  const data = {
    labels: ["Ordenadas", "En Progreso", "Finalizadas"], // Coloca las etiquetas aquí
    datasets: [
      {
        data: [
          migrationStatusCounts.ordered,
          migrationStatusCounts.inProgress,
          migrationStatusCounts.completed,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        enabled: true, // Activar el tooltip
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            return `${value}`; // Formato del tooltip
          },
        },
      },
      legend: {
        display: false, // Desactiva la leyenda del gráfico
      },
    },
    onHover: (event, chartElement) => {
      if (chartElement.length) {
        event.native.target.style.cursor = 'pointer'; // Cambia el cursor al pasar el mouse
      } else {
        event.native.target.style.cursor = 'default'; // Cursor normal si no hay elementos
      }
    },
  };

  return (
    <div>
      <h2 className="text-center m-0 p-0">Estado de las Migraciones</h2>
      <Doughnut className="w-full" data={data} options={options} />
    </div>
  );
};

export default MigrationChart;
