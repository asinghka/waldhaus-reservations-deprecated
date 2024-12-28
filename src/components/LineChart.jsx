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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function LineChart({filterDate}) {
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
        let values = new Array(18).fill(0);

        for (const reservation of filteredReservations) {
            const hour = new Date(reservation.date).getHours() - 11;
            const half = new Date(reservation.date).getMinutes() >= 30;

            values[hour * 2 + half] += reservation.count;
            values[hour * 2 + half + 1] += reservation.count;
        }

        const chartData = {
            labels: Array.from({ length: 18 }, (_, i) => {
                const hour = 11 + Math.floor(i / 2);
                const minutes = (i % 2) * 30;
                const hourStr = hour.toString().padStart(2, '0');
                const minuteStr = minutes.toString().padStart(2, '0');
                return `${hourStr}:${minuteStr}`;
            }),
            datasets: [
                {
                    label: "Personen",
                    data: values,
                    backgroundColor: "rgba(13, 110, 253, 1)",
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

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: maxDataValue + 10,
                ticks: {
                    stepSize: 1,
                }
            },
        }
    };

    return (
        <>
            <Line data={chartData} options={options} height={100} />
        </>
    )
}

export default LineChart;