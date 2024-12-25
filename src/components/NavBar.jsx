import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink} from 'react-router-dom';

function CustomLink({ to, children, ...props }) {
    return (
        <Nav.Item className="ms-2">
            <Nav.Link as={NavLink} to={to} style={{ fontSize: '25px' }} {...props}>{ children }</Nav.Link>
        </Nav.Item>
    )
}

function NavBar() {
    return (
        <Navbar defaultActiveKey="/">
            <Navbar.Brand to="/" className="d-flex align-items-center">
                <img
                    src="../assets/reservation_logo.png"
                    alt="Waldhaus 21 - Hundehütte"
                    style={{height: '70px'}}
                />
                <div style={{textAlign: 'left'}}>
                    <h4 style={{marginTop: '10px'}}>Waldhaus 21</h4>
                    <h4 style={{marginTop: '-15px'}}>Reservierungen</h4>
                </div>
            </Navbar.Brand>
            <Nav className="ms-auto">
            <CustomLink to="/">Heute</CustomLink>
                <CustomLink to="/all">Alle Reservierungen</CustomLink>
            </Nav>
        </Navbar>


    );
}

export default NavBar;