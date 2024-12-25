import ReservationTable from "../components/ReservationTable.jsx";

function All() {
    return (
        <>
            <h2>Alle Reservierungen</h2>
            <ReservationTable filterToday={false} />
        </>
    )
}

export default All;