import { useState } from 'react';
import DatePicker from 'react-widgets/DatePicker';
import { Modal, Button, Form } from 'react-bootstrap';

const ReservationModal = ({ showModal, handleClose, saveReservation }) => {
    // State for form fields
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [count, setCount] = useState(2);
    const [contact, setContact] = useState('');

    const handleSave = () => {
        const reservation = { name, date, time, count, contact };
        saveReservation(reservation); // Call the save function passed as a prop
        setName('');
        setDate(new Date());
        setTime('');
        setCount(2);
        setContact('');
        handleClose(); // Close the modal after saving
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Neue Reservierung</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDate">
                        <Form.Label>Datum</Form.Label>
                        <DatePicker
                            defaultValue={new Date()}
                            value={date}
                            valueEditFormat={{ dateStyle: "short" }}
                            valueDisplayFormat={{ dateStyle: "long" }}
                            onChange={(date) => setDate(date)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTime">
                        <Form.Label>Uhrzeit</Form.Label>
                        <Form.Control
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formCount">
                        <Form.Label>Anzahl Personen</Form.Label>
                        <Form.Control
                            type="number"
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formContact">
                        <Form.Label>Kontaktdaten</Form.Label>
                        <Form.Control
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Schließen
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Speichern
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReservationModal;