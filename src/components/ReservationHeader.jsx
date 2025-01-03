import {Button, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import DatePicker from "react-widgets/DatePicker";
import Localization from "react-widgets/Localization";
import {DateLocalizer} from "react-widgets/IntlLocalizer";
import {useLocation} from "react-router-dom";
import ReservationTable from "./ReservationTable.jsx";
import LineChart from "./LineChart.jsx";


function ReservationHeader({filterToday = false}) {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const year = parseInt(params.get("year"), 10) || new Date().getFullYear();
    const month = parseInt(params.get("month"), 10) - 1 || new Date().getMonth();
    const day = parseInt(params.get("day"), 10) || new Date().getDate();

    const [filterTerm, setFilterTerm] = useState("");
    const [filterDate, setFilterDate] = useState(new Date());

    const [graphView, setgraphView] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setFilterDate(new Date(year, month, day));
    }, [year, month, day]);

    const handleShow = () => setShowModal(true);

    const handleGraph = () => {
        setgraphView(!graphView);
        setFilterTerm('');
    }

    const filterReservation = (reservation) => {
        if (reservation.deleted) return false;

        let isFilterDate;

        if (!filterToday) {
            isFilterDate = new Date(filterDate).toLocaleDateString('de-DE').split('T')[0] === new Date(reservation.date).toLocaleDateString('de-DE').split('T')[0];
        } else {
            isFilterDate = new Date().toLocaleDateString('de-DE').split('T')[0] === new Date(reservation.date).toLocaleDateString('de-DE').split('T')[0];
        }

        return (
            reservation.name.toLowerCase().includes(filterTerm.toLowerCase()) && isFilterDate
        );
    };

    return (
        <>
            <div>
                <Form className="mb-3 d-flex">
                    <Form.Group controlId="nameFilter">
                        <Form.Control
                            className="ms-auto"
                            disabled={graphView}
                            style={{ minWidth: '300px' }}
                            type="text"
                            placeholder="Nach Namen filtern"
                            value={filterTerm}
                            onChange={(e) => setFilterTerm(e.target.value)}
                        />
                    </Form.Group>
                    <Localization date={new DateLocalizer({culture: "de"})}>
                        <Form.Group controlId="dateFilter">
                        {!filterToday &&
                            <DatePicker
                                style={{ width: '250px' }}
                                className="flex ms-3"
                                defaultValue={new Date()}
                                value={filterDate}
                                disabled={filterToday}
                                valueEditFormat={{ dateStyle: "short" }}
                                valueDisplayFormat={{ dateStyle: "long" }}
                                onChange={(date) => setFilterDate(date)}
                            />}
                            {filterToday &&
                            <Form.Control
                                style={{ width: '250px' }}
                                type="text"
                                className="flex ms-3"
                                placeholder={"Heute am " + filterDate.toLocaleDateString('de-DE').split('T')[0]}
                                disabled={true}
                            />}
                        </Form.Group>
                    </Localization>
                    <Form.Switch checked={graphView} className="ms-5 mt-2" label="Tagesübersicht" onChange={handleGraph} />
                    {<Button variant={graphView ? "secondary" : "primary"} className="ms-auto" disabled={graphView} onClick={handleShow}>Neue Reservierung</Button>}
                </Form>
            </div>
            {
                !graphView && (
                    <ReservationTable
                        filterReservation={filterReservation}
                        filterToday={filterToday}
                        filterDate={filterDate}
                        showModal={showModal}
                        setShowModal={setShowModal}
                    />
                )
            }
            {graphView && (<LineChart filterDate={filterDate} />)}
        </>
    );
}

export default ReservationHeader;