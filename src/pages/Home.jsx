import ReservationTable from "../components/ReservationTable.jsx";

function Home() {
    return (
        <>
            <h2>Heutige Reservierungen</h2>
            <ReservationTable filterToday={true} />
        </>
    )
}

export default Home;