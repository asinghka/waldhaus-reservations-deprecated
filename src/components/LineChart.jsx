import {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import {
    LineElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
    PointElement
} from "chart.js";
import {useNavigate} from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function LineChart({filterDate = new Date()}) {
    const [reservations, setReservations] = useState([]);

    const fetchReservations = async () => {
        try {
            const reservations = await window.electron.getReservations();
            setReservations(reservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const filteredReservations = reservations.filter((reservation) => {
        if (reservation.deleted)
            return false;

        const reservationDate = new Date(reservation.date);

        return (
            reservationDate.getFullYear() === filterDate.getFullYear() &&
            reservationDate.getMonth() === filterDate.getMonth() &&
            reservationDate.getDate() === filterDate.getDate()
        );
    })

    const generateChartData = (filteredReservations) => {
        let values = new Array(19).fill(0);

        for (const reservation of filteredReservations) {
            const hour = new Date(reservation.date).getHours() - 11;
            const half = new Date(reservation.date).getMinutes() >= 30;

            values[hour * 2 + half] += reservation.count;
            values[hour * 2 + half + 1] += reservation.count;
        }

        const chartData = {
            labels: Array.from({ length: 19 }, (_, i) => {
                const hour = 11 + Math.floor(i / 2);
                const minutes = (i % 2) * 30;
                const hourStr = hour.toString().padStart(2, '0');
                const minuteStr = minutes.toString().padStart(2, '0');
                return `${hourStr}:${minuteStr}`;
            }),
            datasets: [
                {
                    label: "geschätzte Anzahl an Personen",
                    data: values,
                    backgroundColor: "rgb(51,239,0)",
                    borderColor: "rgba(0, 0, 0, 1)",
                    borderWidth: 2,
                    pointRadius: 8,
                    pointHoverRadius: 12,
                }
            ]
        };

        return chartData;
    }

    const chartData = generateChartData(filteredReservations);
    const maxDataValue = Math.max(...chartData.datasets[0].data);

    const navigate = useNavigate();

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                onClick: null
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: maxDataValue ? Math.ceil(Math.ceil(maxDataValue * 1.1) / 5) * 5 : 10,
                ticks: {
                    stepSize: 5,
                },
                grid: {
                    color: function (context) {
                        if (context.tick.value === 15) {
                            return "rgb(182,182,0)";
                        } else if (context.tick.value === 20) {
                            return "rgb(195,0,0)";
                        } else {
                            return "rgb(0, 0, 0)"
                        }
                    },
                    lineWidth: function (context) {
                        if (context.tick.value === 15) {
                            return 2;
                        } else if (context.tick.value === 20) {
                            return 2;
                        } else {
                            return 1
                        }
                    }
                }
            },
            x: {
                grid: {
                    drawOnChartArea: true,  // Disables vertical grid lines in the chart area
                    drawTicks: true,        // Keeps the ticks and their labels visible
                },
                ticks: {
                    display: true,          // Ensures the labels are displayed
                },
            },
        },
        onClick: () => {
            navigate(`/all?year=${filterDate.getFullYear()}&month=${filterDate.getMonth() + 1}&day=${filterDate.getDate()}`);
        }
    };

    return (
        <>
            <Line data={chartData} options={options} height={100} />
        </>
    )
}

export default LineChart;