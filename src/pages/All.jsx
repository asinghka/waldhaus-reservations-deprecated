import ReservationTable from "../components/ReservationTable.jsx";

function All() {
    return (
        <div className="padding">
            <h2>Alle Reservierungen</h2>
            <ReservationTable filterToday={false}/>
        </div>
    )
}

export default All;