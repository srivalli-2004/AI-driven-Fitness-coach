// Select the form and chart context
const form = document.getElementById('progress-form');
const ctx = document.getElementById('progressChart').getContext('2d');

// Initialize Chart.js
const progressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Dates
        datasets: [{
            label: 'Weight (kg)',
            data: [], // Weights
            borderColor: '#3b5998',
            backgroundColor: 'rgba(59, 89, 152, 0.1)',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Weight (kg)'
                },
                beginAtZero: true
            }
        }
    }
});

// Form Submission Logic
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const weightInput = document.getElementById('weight');
    const dateInput = document.getElementById('date');

    const weight = parseFloat(weightInput.value.trim());
    const date = dateInput.value.trim();

    if (!weight || !date) {
        alert('Please enter both weight and date.');
        console.error('Invalid input:', { weight, date });
        return;
    }

    // Add data to chart
    progressChart.data.labels.push(date);
    progressChart.data.datasets[0].data.push(weight);
    progressChart.update();

    // Clear form inputs
    weightInput.value = '';
    dateInput.value = '';
    console.log('Data added:', { date, weight });
});
