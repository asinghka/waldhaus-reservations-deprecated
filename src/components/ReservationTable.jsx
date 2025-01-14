import {Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import ReservationModal from "./ReservationModal.jsx";

function ReservationTable({filterReservation, filterToday = false, filterDate, showModal, setShowModal, admin = false}) {

    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showLunchBreakDivider, setShowLunchBreakDivider] = useState(false);

    useEffect(() => {
        fetchReservations();
        const intervalId = setInterval(fetchReservations, 60000);
        return () => clearInterval(intervalId);
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

        const reservationDate = new Date(reservation.date);

        const startDate = new Date();
        startDate.setMinutes(startDate.getMinutes() - 15);

        const endDate = new Date();
        endDate.setMinutes(endDate.getMinutes() + 15);

        return reservationDate > startDate && reservationDate < endDate;
    };

    const filteredReservations = reservations.filter((reservation) => {
        return filterReservation(reservation);
    });

    const isAfternoonReservation = (reservation) => {
        const reservationDate = new Date(reservation.date);
        return reservationDate.getHours() < 17;
    }

    useEffect(() => {
        let afternoon = false;
        let evening = false;

        for (const reservation of filteredReservations) {
            const reservationDate = new Date(reservation.date);
            if (reservationDate.getHours() <= 16) {
                afternoon = true;
            }
            if (reservationDate.getHours() >= 17) {
                evening = true;
            }
        }

        setShowLunchBreakDivider(afternoon && evening);
    }, [filteredReservations])

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
                {
                    filteredReservations.map((reservation) => {
                    const current = isCurrentReservations(reservation);
                    if (isAfternoonReservation(reservation)) {
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
                    }
                })}
                {showLunchBreakDivider && (
                    <tr className="table-secondary">
                        <th colSpan={4}>Pause</th>
                    </tr>
                )}
                {
                    filteredReservations.map((reservation) => {
                    const current = isCurrentReservations(reservation);
                    if (!isAfternoonReservation(reservation)) {
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
                    }
                })}
                {!admin &&
                    <tr className="table-secondary">
                        <td colSpan={2}/>
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