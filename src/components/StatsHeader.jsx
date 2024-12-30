import {useState} from "react";
import DatePicker from "react-widgets/DatePicker";
import Localization from "react-widgets/Localization";
import {DateLocalizer} from "react-widgets/IntlLocalizer";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import BarChart from "./BarChart.jsx";
import {Form} from "react-bootstrap";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StatsHeader() {
    const germanMonths = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    const [yearView, setYearView] = useState(false);
    const [countView, setCountView] = useState(false);
    const [filterDate, setFilterDate] = useState(new Date());

    const handleYearView = () => setYearView(!yearView);
    const handleCountView = () => setCountView(!countView);

    return (
        <>
            <h2>{countView && "Personen für"}
                {!countView && "Reservierungen für"}
                {yearView ? " das Jahr " : " den Monat "}
                {yearView && filterDate.getFullYear().toString()}
                {!yearView && germanMonths[filterDate.getMonth()] + " " + filterDate.getFullYear().toString()}
            </h2>
            <Form className="d-flex">
                <Localization date={new DateLocalizer({culture: "de"})}>
                    {yearView && <DatePicker
                        style={{ width: "250px" }}
                        value={filterDate}
                        valueFormat={yearView && { year: "numeric" }}
                        calendarProps={yearView && { views: ["decade", "century"] }}
                        onChange={(date) => {
                            setFilterDate(date);
                        }}
                    />}
                    {!yearView && <DatePicker
                        style={{ width: "250px" }}
                        value={filterDate}
                        valueFormat={{ month: "long", year: "numeric" }}
                        calendarProps={{ views: ["year", "decade", "century"] }}
                        onChange={(date) => {
                            setFilterDate(date);
                        }}
                    />}
                </Localization>
                <Form.Switch className="ms-5 mt-2" label="Jahresübersicht" onChange={handleYearView} />
                <Form.Switch className="ms-auto ms-5 mt-2" label="Personenanzahl" onChange={handleCountView} />
            </Form>
            <BarChart filterDate={filterDate} yearView={yearView} countView={countView} height={100} />
        </>
    )
}

export default StatsHeader;