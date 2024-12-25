import {Button, Form, Table} from "react-bootstrap";
import ReservationModal from "./ReservationModal.jsx";
import {useEffect, useState} from "react";
import DatePicker from "react-widgets/DatePicker";

function ReservationTable({filterToday}) {
    const saveReservation = (reservation) => {
        // Send POST request to backend to save reservation
        fetch('http://localhost:3001/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservation), // Send reservation data as JSON
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Reservation saved:', data);
                // Optionally, refresh the reservation list after saving
                fetchReservations();
            })
            .catch((error) => console.error('Error saving reservation:', error));
    };

    const fetchReservations = () => {
        fetch('http://localhost:3001/reservations')
            .then((response) => response.json())
            .then((data) => setReservations(data))
            .catch((error) => console.error('Error fetching reservations:', error));
    };

    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const [reservations, setReservations] = useState([]);

    const [filterTerm, setFilterTerm] = useState("");
    const [filterDate, setFilterDate] = useState(new Date());

    useEffect(() => {
        // Fetch all reservations from the backend when the component mounts
        fetchReservations();
    }, []);

    const filteredReservations = reservations.filter((reservation) => {
        let isFilterDate;

        if (!filterToday) {
            isFilterDate = new Date(filterDate).toISOString().split('T')[0] === new Date(reservation.date).toISOString().split('T')[0];
        } else {
            isFilterDate = new Date().toISOString().split('T')[0] === new Date(reservation.date).toISOString().split('T')[0];
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
                    <tr key={reservation.id}>
                        <td>{reservation.name}</td>
                        <td>
                            {new Date(reservation.date).toLocaleDateString('de-DE')}
                        </td>
                        <td>
                            {new Date(reservation.time).toLocaleTimeString('de-DE', { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td>{reservation.count}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <ReservationModal showModal={showModal} handleClose={handleClose} saveReservation={saveReservation} />
        </>
    );
}

export default ReservationTable;