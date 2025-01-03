import AdminHeader from "../components/AdminHeader.jsx";
import {Button, Modal} from "react-bootstrap";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function Admin() {
    const [confirmed, setConfirmed] = useState(false);

    const navigate = useNavigate();

    const handleReturn = () => navigate("/");
    const handleConfirm = () => setConfirmed(true);

    return (
        <div className="padding">
            {!confirmed && <div className="modal show" style={{ display: 'block', position: 'initial' }}>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Adminansicht anzeigen?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p style={{ textAlign: "left"}}>In der Adminansicht können gelöschte Reservierungen wiederhergestellt werden.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleReturn}>Zurück</Button>
                        <Button variant="primary" onClick={handleConfirm}>Fortfahren</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>}
            {confirmed && <AdminHeader />}
        </div>
    )
}

export default Admin;