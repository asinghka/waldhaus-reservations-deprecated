import {useState} from "react";
import DatePicker from "react-widgets/DatePicker";
import Localization from "react-widgets/Localization";
import {DateLocalizer} from "react-widgets/IntlLocalizer";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import {Form} from "react-bootstrap";
import ReservationTable from "./ReservationTable.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminHeader() {
    const [showModal, setShowModal] = useState(false);

    const [filterDate, setFilterDate] = useState(null);
    const [filterTerm, setFilterTerm] = useState("");

    const filterReservation = (reservation) => {
        if (!reservation.deleted) return false;

        let isFilterDate = true;
        if (filterDate) {
            isFilterDate = filterDate.toLocaleDateString('de-DE').split('T')[0] === new Date(reservation.date).toLocaleDateString('de-DE').split('T')[0];
        }

        return (
            reservation.name.toLowerCase().includes(filterTerm.toLowerCase()) && isFilterDate
        );
    };

    return (
        <>
            <h2>Gelöschte Reservierungen</h2>
            <hr/>
            <Form className="mb-3 d-flex">
                <Form.Group controlId="nameFilter">
                    <Form.Control
                        className="ms-auto"
                        style={{ minWidth: '300px' }}
                        type="text"
                        placeholder="Nach Namen filtern"
                        value={filterTerm}
                        onChange={(e) => setFilterTerm(e.target.value)}
                    />
                </Form.Group>
                <Localization date={new DateLocalizer({culture: "de"})}>
                    <Form.Group controlId="dateFilter">
                        <DatePicker
                            className="flex ms-3"
                            style={{ width: '250px' }}
                            value={filterDate}
                            valueEditFormat={{ dateStyle: "short" }}
                            valueDisplayFormat={{ dateStyle: "long" }}
                            placeholder="Nach Datum filtern"
                            onChange={(date) => setFilterDate(date)}
                        />
                    </Form.Group>
                </Localization>
            </Form>
            <ReservationTable
                filterReservation={filterReservation}
                filterTerm={filterTerm}
                filterDate={filterDate}
                showModal={showModal}
                setShowModal={setShowModal}
                admin={true}
            />
        </>
    )
}

export default AdminHeader;