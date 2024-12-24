import Nav from 'react-bootstrap/Nav';
import {NavLink} from 'react-router-dom';

function CustomLink({ to, children, ...props }) {
    return (
        <Nav.Item>
            <Nav.Link as={NavLink} to={to} {...props}>{ children }</Nav.Link>
        </Nav.Item>
    )
}

function NavBar() {
    return (
        <Nav fill variant="tabs" defaultActiveKey="/">
            <CustomLink to="/">Heute</CustomLink>
            <CustomLink to="/all">Alle Reservierungen</CustomLink>
        </Nav>
    );
}

export default NavBar;