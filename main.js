'use strict'
const ctx = document.getElementById('chart').getContext('2d')

const labels = [
  '08/04/22',
  '09/04/22',
  '10/04/22',
  '11/04/22',
  '08/04/22',
  '09/04/22',
  '10/04/22',
  '11/04/22',
]

const data = {
  labels: labels,
  datasets: [
    {
      label: 'Weight',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [78.5, 79.0, 78.8, 79.1, 78.5, 79.0, 78.8, 79.1],
    },
  ],
}

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  },
}

const chart = new Chart(ctx, config)
