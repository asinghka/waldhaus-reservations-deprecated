import {useEffect, useState} from "react";
import {Bar} from "react-chartjs-2"
import DatePicker from "react-widgets/DatePicker";
import Localization from "react-widgets/Localization";
import {DateLocalizer} from "react-widgets/IntlLocalizer";
import {useNavigate} from "react-router-dom";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart() {
    const germanMonths = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    const [reservations, setReservations] = useState([]);
    const [date, setDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

        return reservationDate.getMonth() === selectedMonth && reservationDate.getFullYear() === selectedYear;
    })

    const generateChartData = (filteredReservations) => {
        let values = new Array(31).fill(0);

        for (const reservation of filteredReservations) {
            const day = new Date(reservation.date).getDate();
            values[day - 1] += 1;
        }

        const chartData = {
            labels: Array.from({ length: 31 }, (_, i) => (i + 1).toString() + "." + (selectedMonth+1).toString()),
            datasets: [
                {
                    label: "Reservierungen",
                    data: values,
                    backgroundColor: "rgba(13, 110, 253, 1)",
                    borderColor: "rgba(0, 0, 0, 1)",
                    borderWidth: 2
                }
            ]
        };

        return chartData;
    }

    const navigate = useNavigate();

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
                max: 15,
                ticks: {
                    stepSize: 1,
                }
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                navigate(`/all?year=${selectedYear}&month=${selectedMonth + 1}&day=${index + 1}`);
            }
        }
    };

    const chartData = generateChartData(filteredReservations);

    return (
        <>
            <h2>Überblick für den Monat {germanMonths[selectedMonth] + " " + selectedYear.toString()}</h2>
            <Localization date={new DateLocalizer({culture: "de"})}>
                <DatePicker
                    style={{ width: "250px" }}
                    value={date}
                    valueFormat={{ month: "long", year: "numeric" }}
                    calendarProps={{ views: ["year", "decade", "century"] }}
                    onChange={(date) => {
                        setDate(date);
                        setSelectedMonth(date.getMonth());
                        setSelectedYear(date.getFullYear());
                    }}
                />
            </Localization>
            <Bar data={chartData} options={options} height={100} />
        </>
    )
}

export default BarChart;