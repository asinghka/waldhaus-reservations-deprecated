import ReservationTable from "../components/ReservationTable.jsx";

function All() {
    return (
        <>
            <h1>Alle Reservierungen</h1>
            <ReservationTable filterToday={false} />
        </>
    )
}

export default All;