'use strict'

const today = () => {
  const date = new Date()
  return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/')
}

const insertDayWeight = () => {
  const dayWeight = {
    date: today(),
    weight: parseFloat(document.getElementById('weight-input').value) || 0,
  }
  document.getElementById('weight-input').value = ''
  const newModel = JSON.parse(localStorage.getItem('jinsei-app')).filter(
    (dw) => {
      JSON.stringify(dw) !== JSON.stringify(dayWeight)
    }
  )
  newModel.push(dayWeight)
  localStorage.setItem('jinsei-app', JSON.stringify(newModel))
  window.location.reload()
}

const generateChart = () => {
  const ctx = document.getElementById('chart').getContext('2d')

  let dates = []
  let weights = []

  const model = JSON.parse(localStorage.getItem('jinsei-app'))

  model.forEach((dw) => {
    dates.push(dw.date)
    weights.push(dw.weight)
  })

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Weight',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: weights,
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
}

const dateDiff = () => {
  const dayWeights = JSON.parse(localStorage.getItem('jinsei-app'))
  const oldest = dayWeights[0].date.split('/')
  const newest = dayWeights[dayWeights.length - 1].date.split('/')
  const oD = new Date(oldest[1] + '/' + oldest[0] + '/' + oldest[2])
  const nD = new Date(newest[1] + '/' + newest[0] + '/' + newest[2])
  const diffTime = Math.abs(nD - oD)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const weightDiff = () => {
  const dayWeights = JSON.parse(localStorage.getItem('jinsei-app'))
  const oldest = dayWeights[0]
  const newest = dayWeights[dayWeights.length - 1]
  const diff = newest.weight - oldest.weight
  if (Math.sign(diff) === -1) {
    return `<p class="green-text">${Math.abs(diff).toFixed(2)}kg less</p> than`
  }
  if (Math.sign(diff) === 0) {
    return `<p class="green-text">the same</p> as`
  }
  return `<p class="red-text">${Math.abs(diff).toFixed(2)}kg more</p> than`
}

function median(numbers) {
  const sorted = numbers.slice().sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}

const remove20daysago = () => {
  const dayWeights = JSON.parse(localStorage.getItem('jinsei-app'))
  const filtered = dayWeights.filter((dw) => {
    const datesplit = dw.date.split('/')
    const date = new Date(
      datesplit[1] + '/' + datesplit[0] + '/' + datesplit[2]
    )
    const diffTime = Math.abs(new Date() - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 20
  })
  localStorage.setItem('jinsei-app', JSON.stringify(filtered))
}

const predictWeight = () => {
  const dayWeights = JSON.parse(localStorage.getItem('jinsei-app'))
  const weights = dayWeights.map((dw) => dw.weight)
  const middle = Math.floor(weights.length / 2)
  const oldMedian = median(weights.slice(0, middle))
  const newMedian = median(weights.slice(middle))
  return newMedian - oldMedian
}

const main = () => {
  if (!localStorage.getItem('jinsei-app')) {
    localStorage.setItem('jinsei-app', '[]')
  }
  remove20daysago()
  const dayWeights = JSON.parse(localStorage.getItem('jinsei-app'))
  if (dayWeights.length > 0 && dayWeights.length < 5) {
    document.getElementById('motto').innerHTML = 'Keep going!'
    document.getElementById(
      'intro'
    ).innerHTML = `Hello again! Your last weight was: <b>${
      dayWeights[dayWeights.length - 1].weight
    }kg</b>. We still need <b>${
      5 - dayWeights.length
    } more days</b> registered to generate some predictions. Don't forget to come back everyday!`
  }
  if (dayWeights.length >= 5) {
    document.getElementById('display').id = 'chart-container'
    document.getElementById('chart-container').innerHTML =
      '<canvas id="chart" width="600px" height="200px"></canvas>'
    document.getElementById(
      'intro'
    ).innerHTML = `Hello again! Your last weight was: <b>${
      dayWeights[dayWeights.length - 1].weight
    }kg</b>. You weigh ${weightDiff()} <b>${dateDiff()} days ago</b>. At this rate your weight in 20 days would be: <p class="purple-text">${(
      dayWeights[dayWeights.length - 1].weight + predictWeight()
    ).toFixed(2)}kg</p>.`
    generateChart()
  }
}

main()
