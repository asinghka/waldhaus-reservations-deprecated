import ReservationTable from "../components/ReservationTable.jsx";

function Home() {
    return (
        <div className="padding">
            <h2>Heutige Reservierungen</h2>
            <ReservationTable filterToday={true}/>
        </div>
    )
}

export default Home;