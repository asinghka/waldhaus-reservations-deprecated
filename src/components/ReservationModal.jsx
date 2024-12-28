import {useEffect, useState} from 'react';
import DatePicker from 'react-widgets/DatePicker';
import TimeInput from "react-widgets/TimeInput";
import NumberPicker from "react-widgets/NumberPicker";
import {Modal, Button, Form, Alert} from 'react-bootstrap';
import Localization from "react-widgets/Localization";
import {DateLocalizer} from "react-widgets/IntlLocalizer";

const ReservationModal = ({ showModal, handleClose, initialReservations, initialDate }) => {

    const defaultTime = new Date();
    defaultTime.setHours(18, 0, 0, 0);

    const [id, setId] = useState(null);
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(defaultTime);
    const [count, setCount] = useState(2);
    const [contact, setContact] = useState('');
    const [notes, setNotes] = useState('');
    const [deleted, setDeleted] = useState(0);

    const [edit, setEdit] = useState(true);
    const [valid, setValid] = useState(true);

    useEffect(() => {
        if (initialReservations) {
            setEdit(false);
            setId(initialReservations.id);
            setName(initialReservations.name);
            setDate(new Date(initialReservations.date));
            setTime(new Date(initialReservations.date));
            setCount(initialReservations.count);
            setContact(initialReservations.contact);
            setNotes(initialReservations.notes);
            setDeleted(initialReservations.deleted);
        } else {
            resetForm();
        }
    }, [initialDate, initialReservations]);

    const resetForm = () => {
        setId(null);
        setName('');
        setDate(new Date(initialDate));
        date.setHours(18, 0, 0, 0);
        setTime(defaultTime);
        setCount(2);
        setContact('');
        setNotes('');
        setEdit(true);
        setValid(true);
        setDeleted(0);
    };

    const handleSave = async () => {
        if (!name || !date || !count) {
            setValid(false);
            return;
        }

        setValid(true);

        const combinedDate = new Date(date);
        combinedDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);

        const reservation = { id, name, date: combinedDate, count, contact, notes, deleted };
        await window.electron.saveReservation(reservation);
        resetForm();
        handleClose();
    };

    const handleEdit = () => {
        setEdit(true);
    };

    const handleDelete = async () => {
        const reservation = { id, name, date, count, contact, notes, deleted: 1 };
        await window.electron.saveReservation(reservation);
        resetForm();
        handleClose();
    };

    return (
        <Modal centered show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                {(initialReservations && <Modal.Title>Bestehende Reservierung</Modal.Title>)}
                {(!initialReservations && <Modal.Title>Neue Reservierung</Modal.Title>)}
            </Modal.Header>
            <Modal.Body>
                {!valid && <Alert variant="danger">Es fehlen notwendige Informationen!</Alert>}
                <Localization date={new DateLocalizer({culture: "de"})}>
                    <Form>
                        <Form.Group className="pt-2" controlId="formName">
                            <Form.Label>Name (<span style={{ color: "darkred" }}>*</span>)</Form.Label>
                            <Form.Control
                                autoFocus
                                disabled={!edit}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="pt-2" controlId="formDate">
                            <Form.Label>Datum (<span style={{ color: "darkred" }}>*</span>)</Form.Label>
                            <DatePicker
                                disabled={!edit}
                                value={date}
                                min={new Date(date)}
                                valueEditFormat={{ dateStyle: "short" }}
                                valueDisplayFormat={{ dateStyle: "long" }}
                                onChange={(selectedDate) => setDate(selectedDate)}
                            />
                        </Form.Group>
                        <Form.Group className="pt-2" controlId="formTime">
                            <Form.Label>Uhrzeit (<span style={{ color: "darkred" }}>*</span>)</Form.Label><br/>
                            <TimeInput
                                disabled={!edit}
                                value={time}
                                onChange={(selectedTime) => setTime(selectedTime)}
                            />
                        </Form.Group>
                        <Form.Group className="pt-2" controlId="formCount">
                            <Form.Label>Anzahl Personen (<span style={{ color: "darkred" }}>*</span>)</Form.Label>
                            <NumberPicker
                                disabled={!edit}
                                value={count}
                                precision={0}
                                min={1}
                                max={80}
                                onChange={(count) => setCount(count)}
                            />
                        </Form.Group>
                        <Form.Group className="pt-2" controlId="formContact">
                            <Form.Label>Kontaktdaten</Form.Label>
                            <Form.Control
                                disabled={!edit}
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="pt-2" controlId="formNotes">
                            <Form.Label>Anmerkungen</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                disabled={!edit}
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Localization>
            </Modal.Body>
            <Modal.Footer>
                {
                    ( initialReservations && edit && <Button className="me-auto" variant="danger" onClick={handleDelete}>Löschen</Button>)
                }
                <Button variant="secondary" onClick={handleClose}>
                    Schließen
                </Button>
                {
                    ( !edit && <Button variant="warning" onClick={handleEdit}>Bearbeiten</Button> )
                    ||
                    ( edit && <Button variant="primary" onClick={handleSave}>Speichern</Button> )
                }
            </Modal.Footer>
        </Modal>
    );
};

export default ReservationModal;