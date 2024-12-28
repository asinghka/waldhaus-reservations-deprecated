import ReservationHeader from "../components/ReservationHeader.jsx";

function Admin() {
    return (
        <div className="padding">
            <h2>Admin</h2>
            <ReservationHeader filterToday={false} admin={true}/>
        </div>
    )
}

export default Admin;