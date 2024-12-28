import {useState} from "react";
import DatePicker from "react-widgets/DatePicker";
import Localization from "react-widgets/Localization";
import {DateLocalizer} from "react-widgets/IntlLocalizer";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import {Form} from "react-bootstrap";
import BarChart from "./BarChart.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function OverviewHeader() {
    const germanMonths = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    const [filterDate, setFilterDate] = useState(new Date());

    return (
        <>
            <h2>Überblick für den Monat {germanMonths[filterDate.getMonth()] + " " + filterDate.getFullYear().toString()}</h2>
            <Localization date={new DateLocalizer({culture: "de"})}>
                <DatePicker
                    style={{ width: "250px" }}
                    value={filterDate}
                    valueFormat={{ month: "long", year: "numeric" }}
                    calendarProps={{ views: ["year", "decade", "century"] }}
                    onChange={(date) => {
                        setFilterDate(date);
                    }}
                />
            </Localization>
            <BarChart filterDate={filterDate}  height={100} />
        </>
    )
}

export default OverviewHeader;