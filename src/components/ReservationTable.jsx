import {Table} from "react-bootstrap";
import {useState} from "react";
import ReservationModal from "./ReservationModal.jsx";

function ReservationTable({fetchReservations, reservations, filterToday = false, filterDate, showModal, setShowModal, admin = false}) {

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

    const isPastReservation = (reservation) => {
        if (!filterToday) return false;

        const reservationTime = new Date(reservation.date);
        const now = new Date();

        return reservationTime < now;
    };

    return (
        <>
            <Table bordered hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Datum</th>
                    <th>Uhrzeit</th>
                    <th>Anzahl</th>
                </tr>
                </thead>
                <tbody>
                {reservations.map((reservation) => {
                    const passed = isPastReservation(reservation);

                    return (
                        <tr className={passed ? "table-secondary" : ""} key={reservation.id} onClick={() => handleRowClick(reservation)} style={{ cursor: 'pointer' }}>
                            <td>{reservation.name}</td>
                            <td>
                                {new Date(reservation.date).toLocaleDateString('de-DE')}
                            </td>
                            <td>
                                {new Date(reservation.date).toLocaleTimeString('de-DE', { hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td>{reservation.count}</td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
            <ReservationModal
                showModal={showModal}
                handleClose={handleClose}
                initialDate={filterDate}
                initialReservations={selectedReservation}
                admin={admin}
            />
        </>
    );
}

export default ReservationTable;