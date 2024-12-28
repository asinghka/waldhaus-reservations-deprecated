import {Button, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import DatePicker from "react-widgets/DatePicker";
import Localization from "react-widgets/Localization";
import {DateLocalizer} from "react-widgets/IntlLocalizer";
import {useLocation} from "react-router-dom";
import ReservationTable from "./ReservationTable.jsx";


function ReservationHeader({filterToday}) {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const year = parseInt(params.get("year"), 10) || new Date().getFullYear();
    const month = parseInt(params.get("month"), 10) - 1 || new Date().getMonth(); // month is zero-indexed
    const day = parseInt(params.get("day"), 10) || new Date().getDate();

    const [reservations, setReservations] = useState([]);

    const [filterTerm, setFilterTerm] = useState("");
    const [filterDate, setFilterDate] = useState(null);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        setFilterDate(new Date(year, month, day));
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
        if (reservation.deleted) return false;

        let isFilterDate;

        if (!filterToday) {
            isFilterDate = new Date(filterDate).toLocaleDateString('de-DE').split('T')[0] === new Date(reservation.date).toLocaleDateString('de-DE').split('T')[0];
        } else {
            isFilterDate = new Date().toLocaleDateString('de-DE').split('T')[0] === new Date(reservation.date).toLocaleDateString('de-DE').split('T')[0];
        }

        return (
            reservation.name.toLowerCase().includes(filterTerm.toLowerCase()) && isFilterDate
        );
    });

    const handleShow = () => setShowModal(true);

    return (
        <>
            <div>
                <Form className="mb-3 d-flex">
                    <Form.Group controlId="nameFilter">
                        <Form.Control
                            className="ms-auto"
                            style={{ minWidth: '300px' }}
                            type="text"
                            placeholder="Nach Namen filtern"
                            value={filterTerm}
                            onChange={(e) => setFilterTerm(e.target.value)}
                        />
                    </Form.Group>
                    <Localization date={new DateLocalizer({culture: "de"})}>
                        { !filterToday && (
                            <Form.Group controlId="dateFilter">
                                <DatePicker
                                    className="flex ms-3"
                                    defaultValue={new Date()}
                                    value={filterDate}
                                    valueEditFormat={{ dateStyle: "short" }}
                                    valueDisplayFormat={{ dateStyle: "long" }}
                                    onChange={(date) => setFilterDate(date)}
                                />
                            </Form.Group>
                        ) }
                    </Localization>
                    {
                        filterToday && (
                            <Form.Switch className="ms-5 mt-2" label="Graph Ansicht"/>
                        )
                    }
                    <Button className="ms-auto" onClick={handleShow}>Neue Reservierung</Button>
                </Form>
            </div>
            <ReservationTable
                fetchReservations={fetchReservations}
                reservations={filteredReservations}
                filterToday={filterToday}
                filterDate={filterDate}
                filterTerm={filterTerm}
                showModal={showModal}
                setShowModal={setShowModal}
            />
        </>
    );
}

export default ReservationHeader;