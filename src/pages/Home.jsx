import ReservationHeader from "../components/ReservationHeader.jsx";

function Home() {
    return (
        <div className="padding">
            <h2>Heutige Reservierungen</h2>
            <hr/>
            <ReservationHeader filterToday={true}/>
        </div>
    )
}

export default Home;