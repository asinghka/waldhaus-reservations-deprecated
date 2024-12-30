import {useEffect, useState} from "react";
import DatePicker from "react-widgets/DatePicker";
import Localization from "react-widgets/Localization";
import {DateLocalizer} from "react-widgets/IntlLocalizer";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import BarChart from "./BarChart.jsx";
import {Form} from "react-bootstrap";
import ReservationTable from "./ReservationTable.jsx";
import {useLocation} from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminHeader() {
    const germanMonths = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const year = parseInt(params.get("year"), 10) || new Date().getFullYear();
    const month = parseInt(params.get("month"), 10) - 1 || new Date().getMonth();
    const day = parseInt(params.get("day"), 10) || new Date().getDate();

    const [reservations, setReservations] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [graphView, setGraphView] = useState(false);
    const [filterDate, setFilterDate] = useState(new Date());
    const [filterTerm, setFilterTerm] = useState("");

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        setFilterDate(new Date(year, month, day));
        setGraphView(false);
    }, [year, month, day]);

    const fetchReservations = async () => {
        try {
            const reservations = await window.electron.getReservations();
            const sortedReservations = reservations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setReservations(sortedReservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const filteredReservations = reservations.filter((reservation) => {
        if (!reservation.deleted) return false;

        const isFilterDate = filterDate.toLocaleDateString('de-DE').split('T')[0] === new Date(reservation.date).toLocaleDateString('de-DE').split('T')[0];

        return (
            reservation.name.toLowerCase().includes(filterTerm.toLowerCase()) && isFilterDate
        );
    });


    const handleGraphView = () => setGraphView(!graphView);

    return (
        <>
            <h2>Gelöschte Reservierungen für
                {!graphView && " den Tag " + filterDate.toLocaleDateString('de-DE')}
                {graphView && " den Monat " + germanMonths[filterDate.getMonth()]}
            </h2>
            <hr/>
            <Form className="mb-3 d-flex">
                <Form.Group controlId="nameFilter">
                    <Form.Control
                        className="ms-auto"
                        disabled={graphView}
                        style={{ minWidth: '300px' }}
                        type="text"
                        placeholder="Nach Namen filtern"
                        value={filterTerm}
                        onChange={(e) => setFilterTerm(e.target.value)}
                    />
                </Form.Group>
                <Localization date={new DateLocalizer({culture: "de"})}>
                    <Form.Group controlId="dateFilter">
                        {!graphView && <DatePicker
                            className="flex ms-3"
                            value={filterDate}
                            valueEditFormat={{ dateStyle: "short" }}
                            valueDisplayFormat={{ dateStyle: "long" }}
                            onChange={(date) => setFilterDate(date)}
                        />}
                        {graphView && <DatePicker
                            className="flex ms-3"
                            style={{ width: "250px" }}
                            value={filterDate}
                            valueFormat={{ month: "long", year: "numeric" }}
                            calendarProps={{ views: ["year", "decade", "century"] }}
                            onChange={(date) => {
                                setFilterDate(date);
                            }}
                        />}
                    </Form.Group>
                </Localization>
                <Form.Switch checked={graphView} className="ms-5 mt-2" label="Monatsübersicht" onChange={handleGraphView} />
            </Form>

            {!graphView && <ReservationTable
                fetchReservations={fetchReservations}
                reservations={filteredReservations}
                filterDate={filterDate}
                showModal={showModal}
                setShowModal={setShowModal}
                admin={true}
            />}
            {graphView && <BarChart filterDate={filterDate} height={100} admin={true} />}
        </>
    )
}

export default AdminHeader;