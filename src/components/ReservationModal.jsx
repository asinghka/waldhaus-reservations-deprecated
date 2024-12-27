import {useEffect, useState} from 'react';
import DatePicker from 'react-widgets/DatePicker';
import TimeInput from "react-widgets/TimeInput";
import NumberPicker from "react-widgets/NumberPicker";
import { Modal, Button, Form } from 'react-bootstrap';

const ReservationModal = ({ showModal, handleClose, saveReservation, initialReservations }) => {
    const [id, setId] = useState(null);
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [count, setCount] = useState(2);
    const [contact, setContact] = useState('');
    const [notes, setNotes] = useState('');
    const [deleted, setDeleted] = useState(0);

    const [edit, setEdit] = useState(true);

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
    }, [initialReservations]);

    const resetForm = () => {
        setId(null);
        setName('');
        setDate(new Date());
        setTime(new Date());
        setCount(2);
        setContact('');
        setNotes('');
        setEdit(true);
        setDeleted(0);
    };

    const handleSave = () => {
        const reservation = { id, name, date, count, contact, notes, deleted };
        saveReservation(reservation);
        resetForm();
        handleClose();
    };

    const handleEdit = () => {
        setEdit(true);
    }

    const handleDelete = () => {
        const reservation = { id, name, date, count, contact, notes, deleted: 1 };
        saveReservation(reservation);
        resetForm();
        handleClose();
    }

    return (
        <Modal centered show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                {
                    (initialReservations && <Modal.Title>Bestehende Reservierung</Modal.Title>)
                    ||
                    (!initialReservations && <Modal.Title>Neue Reservierung</Modal.Title>)
                }

            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            autoFocus
                            disabled={!edit}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDate">
                        <Form.Label>Datum</Form.Label>
                        <DatePicker
                            disabled={!edit}
                            value={date}
                            valueEditFormat={{ dateStyle: "short" }}
                            valueDisplayFormat={{ dateStyle: "long" }}
                            onChange={(date) => setDate(date)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTime">
                        <Form.Label>Uhrzeit</Form.Label><br/>
                        <TimeInput
                            disabled={!edit}
                            value={time}
                            onChange={(time) => {
                                setTime(time);

                                const updatedDate = new Date(date);

                                const hours = time.getHours();
                                console.log(time);
                                console.log(hours);
                                const minutes = time.getMinutes();
                                const seconds = time.getSeconds();

                                updatedDate.setHours(hours, minutes, seconds, 0);
                                setDate(updatedDate);
                            }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formCount">
                        <Form.Label>Anzahl Personen</Form.Label>
                        <NumberPicker
                            disabled={!edit}
                            value={count}
                            precision={0}
                            min={1}
                            max={80}
                            onChange={(count) => setCount(count)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formContact">
                        <Form.Label>Kontaktdaten</Form.Label>
                        <Form.Control
                            disabled={!edit}
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formNotes">
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