import ReservationHeader from "../components/ReservationHeader.jsx";

function All() {
    return (
        <div className="padding">
            <h2>Reservierungen</h2>
            <ReservationHeader filterToday={false}/>
        </div>
    )
}

export default All;