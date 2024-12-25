import {Button, Form, Table} from "react-bootstrap";
import ReservationModal from "./ReservationModal.jsx";
import {useEffect, useState} from "react";

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

    useEffect(() => {
        // Fetch all reservations from the backend when the component mounts
        fetchReservations();
    }, []);

    const today = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'

    const filteredReservations = reservations.filter((reservation) => {
        const isToday = new Date(reservation.date).toISOString().split('T')[0] === today;

        return (
            reservation.name.toLowerCase().includes(filterTerm.toLowerCase()) &&
            (!filterToday || isToday)
        );
    });

    return (
        <>
            <div>
                <Form className="mb-3 d-flex">
                    <Form.Group controlId="nameFilter">
                        <Form.Control
                            className="ms-auto"
                            size="lg"
                            style={{ minWidth: '300px' }}
                            type="text"
                            placeholder="Nach Namen filtern"
                            value={filterTerm}
                            onChange={(e) => setFilterTerm(e.target.value)}
                        />
                    </Form.Group>
                    <Button size="lg" className="ms-auto" onClick={handleShow}>Neue Reservierung</Button>
                </Form>
            </div>
            <Table striped bordered hover variant="">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Datum</th>
                    <th>Uhrzeit</th>
                    <th>Anzahl</th>
                    <th>Kontakt</th>
                </tr>
                </thead>
                <tbody>
                {filteredReservations.map((reservation) => (
                    <tr key={reservation.id}>
                        <td>{reservation.name}</td>
                        <td>
                            {new Date(reservation.date).toLocaleDateString('de-DE')}
                        </td>
                        <td>{reservation.time}</td>
                        <td>{reservation.count}</td>
                        <td>{reservation.contact ? reservation.contact : "-"}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <ReservationModal showModal={showModal} handleClose={handleClose} saveReservation={saveReservation} />
        </>
    );
}

export default ReservationTable;