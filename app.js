const jsonForm = document.querySelector('#jsonInputForm')
const jsonInput = document.querySelector('#jsonInput')
const chartCanvas = document.querySelector('#myChart')
let myChart = null
let dataType = "hourly"
let switching = true

const dailyBtn = document.querySelector('#dailyBtn')
const hourlyBtn = document.querySelector('#hourlyBtn')
const chartTitle = document.querySelector('#chartTitle')

dailyBtn.addEventListener('click', () => {
    if (!switching) {
        chartTitle.textContent = 'Junk Simulator Daily Robux Data'
        switching = true
        dataType = 'daily'
        fetchData()
    }
})

hourlyBtn.addEventListener('click', () => {
    if (!switching) {
        chartTitle.textContent = 'Junk Simulator Hourly Robux Data'
        switching = true
        dataType = 'hourly'
        fetchData()
    }
})

function fetchData() {
    fetch("http://localhost:3000/" + dataType)
    .then(res => res.json())
    .then(data => {
        buildChart(data)
        switching = false
    })
}

fetchData()

function convertTimestamp(timestamp) {
    timestamp = Number(timestamp)
    var d = new Date(timestamp),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }

    // ie: 2014-03-24, 3:00 PM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
    return time;
}

function buildChart(data) {
    if (myChart) {
        console.log("destroyed")
        myChart.destroy();
    }

    const labels = []
    const chartData = []

    for (millisec in data.data.Total.data) {
        labels.push(convertTimestamp(millisec))
        chartData.push(data.data.Total.data[millisec])
    }

    const totalDataSet = {
        labels: labels,
        datasets: [{
        label: 'Robux Total',
        backgroundColor: 'rgb(52, 155, 235)',
        borderColor: 'rgb(52, 155, 235)',
        data: chartData,
        }]
    }

    const config = {
        type: 'line',
        data: totalDataSet,
        options: {}
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}

jsonForm.addEventListener('submit', (e) => {
    e.preventDefault()
})