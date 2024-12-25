import {Button, Table} from "react-bootstrap";
import ReservationModal from "./ReservationModal.jsx";
import {useEffect, useState} from "react";

function ReservationTable() {
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
    useEffect(() => {
        // Fetch all reservations from the backend when the component mounts
        fetchReservations();
    }, []);

    return (
        <>
            <Table striped bordered hover variant="dark">
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
                {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                        <td>{reservation.name}</td>
                        <td>
                            {new Date(reservation.date).toLocaleDateString('de-DE')}
                        </td>
                        <td>{reservation.time}</td>
                        <td>{reservation.count}</td>
                        <td>{reservation.contact}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <Button onClick={handleShow}>Neue Reservierung</Button>
            <ReservationModal showModal={showModal} handleClose={handleClose} saveReservation={saveReservation} />
        </>
    );
}

export default ReservationTable;