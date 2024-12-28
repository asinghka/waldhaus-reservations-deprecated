import {Button, Form, Table} from "react-bootstrap";
import ReservationModal from "./ReservationModal.jsx";
import {useEffect, useState} from "react";
import DatePicker from "react-widgets/DatePicker";
import Localization from "react-widgets/Localization";
import {DateLocalizer} from "react-widgets/IntlLocalizer";
import {useLocation} from "react-router-dom";


function ReservationTable({filterToday}) {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const year = parseInt(params.get("year"), 10) || new Date().getFullYear();
    const month = parseInt(params.get("month"), 10) - 1 || new Date().getMonth(); // month is zero-indexed
    const day = parseInt(params.get("day"), 10) || new Date().getDate();

    const saveReservation = async (reservation) => {
        try {
            await window.electron.saveReservations(reservation);
            console.log('Reservation saved');
            await fetchReservations();
        } catch (error) {
            console.error('Error saving reservation:', error);
        }
    };

    const fetchReservations = async () => {
        try {
            const reservations = await window.electron.getReservations();
            setReservations(reservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setSelectedReservation(null)
        setShowModal(false);
        fetchReservations();
    };

    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);

    const [filterTerm, setFilterTerm] = useState("");
    const [filterDate, setFilterDate] = useState(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        setFilterDate(new Date(year, month, day));
    }, [year, month, day]);

    const handleRowClick = (reservation) => {
        setSelectedReservation(reservation);
        setShowModal(true);
    }

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
                    <Button className="ms-auto" onClick={handleShow}>Neue Reservierung</Button>
                </Form>
            </div>
            <Table striped bordered hover variant="">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Datum</th>
                    <th>Uhrzeit</th>
                    <th>Anzahl</th>
                </tr>
                </thead>
                <tbody>
                {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} onClick={() => handleRowClick(reservation)} style={{ cursor: 'pointer' }}>
                        <td>{reservation.name}</td>
                        <td>
                            {new Date(reservation.date).toLocaleDateString('de-DE')}
                        </td>
                        <td>
                            {new Date(reservation.date).toLocaleTimeString('de-DE', { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td>{reservation.count}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <ReservationModal showModal={showModal} handleClose={handleClose} saveReservation={saveReservation} initialReservations={selectedReservation} />
        </>
    );
}

export default ReservationTable;