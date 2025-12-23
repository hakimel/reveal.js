// Initialize Reveal.js
Reveal.initialize({
    hash: true,
    controls: true,
    progress: true,
    center: true,
    transition: 'slide'
});

// Create the bar chart when the slide is loaded
Reveal.addEventListener('ready', function() {
    createBarChart();
});

// Recreate chart when navigating to the slide (in case of viewport changes)
Reveal.addEventListener('slidechanged', function(event) {
    if (event.currentSlide.querySelector('#barChart')) {
        // Add a small delay to ensure the slide transition is complete
        setTimeout(createBarChart, 50);
    }
});

function createBarChart() {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;
    
    // MODIFICATION AREA: Update this data with your chart information
    const chartData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                label: 'Electronics',
                data: [65, 59, 80, 81],
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
                borderWidth: 1
            },
            {
                label: 'Clothing',
                data: [28, 48, 40, 35],
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1
            },
            {
                label: 'Home Goods',
                data: [45, 55, 60, 65],
                backgroundColor: '#FFCE56',
                borderColor: '#FFCE56',
                borderWidth: 1
            }
        ]
    };
    
    const config = {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Sales (in $1000s)',
                        color: '#586e75',
                        font: {
                            size: 14
                        }
                    },
                    ticks: {
                        color: '#586e75'
                    },
                    grid: {
                        color: 'rgba(88, 110, 117, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Quarter',
                        color: '#586e75',
                        font: {
                            size: 14
                        }
                    },
                    ticks: {
                        color: '#586e75'
                    },
                    grid: {
                        color: 'rgba(88, 110, 117, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        },
                        color: '#586e75'
                    }
                },
                tooltip: {
                    bodyFont: {
                        size: 14
                    },
                    titleFont: {
                        size: 16
                    }
                }
            }
        }
    };
    
    // Destroy previous chart instance if it exists
    if (window.barChartInstance) {
        window.barChartInstance.destroy();
    }
    
    // Create new chart instance
    window.barChartInstance = new Chart(ctx, config);
}