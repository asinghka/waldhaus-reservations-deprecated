import {useCallback, useEffect, useState} from 'react';
import DatePicker from 'react-widgets/DatePicker';
import TimeInput from "react-widgets/TimeInput";
import NumberPicker from "react-widgets/NumberPicker";
import {Alert, Button, Col, Form, Modal, Row} from 'react-bootstrap';
import Localization from "react-widgets/Localization";
import {DateLocalizer} from "react-widgets/IntlLocalizer";

const ReservationModal = ({ showModal, handleClose, reservations, initialReservations, initialDate, admin = false }) => {

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

    const capacity = Object.freeze({
        GREEN: 0,
        YELLOW: 1,
        RED: 2
    })

    const [currentCapacity, setCurrentCapacity] = useState(capacity.GREEN);
    const [capacityMessage, setCapacityMessage] = useState('');

    const [valid, setValid] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');

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

    useEffect(() => {
        setCapacity();
    }, []);

    useEffect(() => {
        setCapacity();
    }, [date, time, count]);

    const setCapacity = useCallback(() => {
        let combinedDate = new Date();
        if (date) {
            combinedDate = new Date(date);
        }
        if (time) {
            combinedDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);
        }

        const startDate = new Date(combinedDate);
        startDate.setMinutes(combinedDate.getMinutes() - 15);

        const endDate = new Date(combinedDate);
        endDate.setMinutes(combinedDate.getMinutes() + 15);

        const filteredReservations = reservations.filter((reservation) => {
            if (initialReservations && initialReservations.id === reservation.id) return false;
            if (reservation.deleted) return false;

            const reservationDate = new Date(reservation.date);

            return reservationDate >= startDate && reservationDate <= endDate;
        });

        let sum = 0;
        for (const reservation of filteredReservations) {
            sum += reservation.count;
        }
        sum += count;

        if (sum >= 20) {
            setCurrentCapacity(capacity.RED);
            setCapacityMessage('Hohe Auslastung (' + sum + ' Personen erscheinen zu ähnlicher Uhrzeit!)')
        }
        else if (sum >= 15) {
            setCurrentCapacity(capacity.YELLOW);
            setCapacityMessage('Mittlere Auslastung (' + sum + ' Personen erscheinen zu ähnlicher Uhrzeit)')
        }
        else {
            setCurrentCapacity(capacity.GREEN);
            setCapacityMessage('Geringe Auslastung (' + sum + ' Personen erscheinen zu ähnlicher Uhrzeit)');
        }
    }, [date, time, count, reservations, initialReservations])

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

    const validateForm = () => {
        if (!name) {
             setAlertMessage('Bitte Namen eingeben.');
            setValid(false);
            return false;
        }

        if (!date) {
            setAlertMessage('Bitte Datum auswählen.');
            setValid(false);
            return false;
        }

        if (!time) {
            setAlertMessage('Bitte Uhrzeit eingeben.');
            setValid(false);
            return false;
        }

        if (!count) {
            setAlertMessage('Bitte Personenanzahl eingeben.');
            setValid(false);
            return false;
        }

        if (time.getHours() > 21 || time.getHours() < 11) {
            setAlertMessage('Uhrzeit außerhalb Öffnungszeiten.');
            setValid(false);
            return false;
        }

        if (count < 1 || count > 70) {
            setAlertMessage('Bitte gültige Personenanzahl eingeben.');
            setValid(false);
            return false;
        }

        setValid(true);
        return true;
    }

    const handleSave = async () => {
        if (!validateForm()) return;

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

    const handleRestore = async () => {
        if (!validateForm()) return;

        const combinedDate = new Date(date);
        combinedDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);

        const reservation = { id, name, date: combinedDate, count, contact, notes, deleted: 0 };
        await window.electron.saveReservation(reservation);
        resetForm();
        handleClose();
    }

    return (
        <Modal centered show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                {(admin && initialReservations && <Modal.Title>Gelöschte Reservierung</Modal.Title>)}
                {(!admin && initialReservations && <Modal.Title>Bestehende Reservierung</Modal.Title>)}
                {(!admin && !initialReservations && <Modal.Title>Neue Reservierung</Modal.Title>)}
            </Modal.Header>
            <Modal.Body>
                {!valid && <Alert variant="danger">{alertMessage}</Alert>}
                <Localization date={new DateLocalizer({culture: "de"})}>
                    <Form>
                        <Row>
                            <Col xs={4}>
                                <Form.Group controlId="formName">
                                <Form.Label>Name (<span style={{ color: "darkred" }}>*</span>)</Form.Label>
                                <Form.Control
                                    disabled={!edit}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group controlId="formDate">
                                <Form.Label>Datum (<span style={{ color: "darkred" }}>*</span>)</Form.Label>
                                <DatePicker
                                    inputProps={{ readOnly: true }}
                                    disabled={!edit}
                                    value={date}
                                    min={new Date()}
                                    valueEditFormat={{ dateStyle: "short" }}
                                    valueDisplayFormat={{ dateStyle: "long" }}
                                    onChange={(selectedDate) => setDate(selectedDate)}
                                />
                            </Form.Group>
                            </Col>
                            <Col xs={2}>
                                <Form.Group controlId="formTime">
                                <Form.Label>Uhrzeit (<span style={{ color: "darkred" }}>*</span>)</Form.Label><br/>
                                <TimeInput
                                    disabled={!edit}
                                    value={time}
                                    onChange={(selectedTime) => setTime(selectedTime)}
                                />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Form.Group style={{ width: '220px' }} className="pt-2" controlId="formCount">
                                    <Form.Label>Anzahl Personen (<span style={{ color: "darkred" }}>*</span>)</Form.Label>
                                    <NumberPicker
                                        disabled={!edit}
                                        value={count}
                                        min={1}
                                        max={70}
                                        precision={0}
                                        onChange={(count) => setCount(count)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={8}>
                                <Form.Group className="pt-3">
                                    <Form.Label></Form.Label>
                                    <Form.Control
                                        disabled={true}
                                        type="text"
                                        placeholder={capacityMessage}
                                        className={
                                            currentCapacity === capacity.GREEN ? 'form-control-success'
                                            : currentCapacity === capacity.YELLOW ? 'form-control-warning'
                                            : 'form-control-danger'
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Form.Group className="pt-3" controlId="formContact">
                                <Form.Label>Kontaktdaten</Form.Label>
                                <Form.Control
                                    disabled={!edit}
                                    type="text"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="pt-3" controlId="formNotes">
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
                        </Row>
                    </Form>
                </Localization>
            </Modal.Body>
            <Modal.Footer>
                {( !admin && initialReservations && edit && <Button className="me-auto" variant="danger" onClick={handleDelete}>Löschen</Button>)}
                <Button variant="secondary" onClick={handleClose}>
                    Schließen
                </Button>
                {( !edit && <Button variant="warning" onClick={handleEdit}>Bearbeiten</Button> )}
                {( !admin && edit && <Button variant="primary" onClick={handleSave}>Speichern</Button> )}
                {( admin && initialReservations && edit && <Button variant="success" onClick={handleRestore}>Wiederherstellen</Button>)}
            </Modal.Footer>
        </Modal>
    );
};

export default ReservationModal;