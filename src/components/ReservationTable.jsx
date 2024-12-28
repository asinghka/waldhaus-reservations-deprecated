import {Table} from "react-bootstrap";
import {useState} from "react";
import ReservationModal from "./ReservationModal.jsx";

function ReservationTable({fetchReservations, reservations, filterDate, showModal, setShowModal}) {

    const [selectedReservation, setSelectedReservation] = useState(null);

    const handleClose = () => {
        setSelectedReservation(null);
        setShowModal(false);
        fetchReservations();
    };

    const handleRowClick = (reservation) => {
        setSelectedReservation(reservation);
        setShowModal(true);
    }

    return (
        <>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Datum</th>
                    <th>Uhrzeit</th>
                    <th>Anzahl</th>
                </tr>
                </thead>
                <tbody>
                {reservations.map((reservation) => (
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
            <ReservationModal
                showModal={showModal}
                handleClose={handleClose}
                initialDate={filterDate}
                initialReservations={selectedReservation}
            />
        </>
    );
}

export default ReservationTable;