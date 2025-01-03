import {Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import ReservationModal from "./ReservationModal.jsx";

function ReservationTable({filterReservation, filterToday = false, filterDate, showModal, setShowModal, admin = false}) {

    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const reservations = await window.electron.getReservations();
            const sortedReservations = reservations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setReservations(sortedReservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const handleClose = () => {
        setSelectedReservation(null);
        setShowModal(false);
        fetchReservations();
    };

    const handleRowClick = (reservation) => {
        setSelectedReservation(reservation);
        setShowModal(true);
    }

    const isCurrentReservations = (reservation) => {
        if (!filterToday) return false;

        const reservationTime = new Date(reservation.date);
        const now = new Date();

        return reservationTime > now.setMinutes(now.getMinutes() - 15) && reservationTime < now.setMinutes(now.getMinutes() + 15);
    };

    const filteredReservations = reservations.filter((reservation) => {
        return filterReservation(reservation);
    });

    const sumPeople = () => {
        let sum = 0;

        for (const reservation of reservations) {
            const isFilterDate = new Date(filterDate).toLocaleDateString('de-DE').split('T')[0] === new Date(reservation.date).toLocaleDateString('de-DE').split('T')[0];
            if (isFilterDate) {
                sum += reservation.count;
            }
        }
        return sum;
    }

    return (
        <>
            <Table bordered hover>
                <thead>
                <tr className="table-secondary">
                    <th>Name</th>
                    <th>Datum</th>
                    <th>Uhrzeit</th>
                    <th>Anzahl</th>
                </tr>
                </thead>
                <tbody>
                {filteredReservations.map((reservation) => {
                    const current = isCurrentReservations(reservation);

                    return (
                        <tr className={current ? "table-success" : ""} key={reservation.id} onClick={() => handleRowClick(reservation)} style={{ cursor: 'pointer' }}>
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
                {!admin && reservations.length > 0 &&
                    <tr className="table-secondary">
                        <td/>
                        <td/>
                        <th>Summe Personen</th>
                        <th>{sumPeople()}</th>
                    </tr>
                }
                </tbody>
            </Table>
            <ReservationModal
                showModal={showModal}
                handleClose={handleClose}
                reservations={reservations}
                initialDate={filterDate}
                initialReservations={selectedReservation}
                admin={admin}
            />
        </>
    );
}

export default ReservationTable;