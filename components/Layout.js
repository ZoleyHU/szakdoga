import React from "react";
import "semantic-ui-css/semantic.min.css";
import NavigationBar from "./NavigationBar";
import {Container} from "semantic-ui-react";

const Layout = (props) => {
    return (
        <Container>
            <Container textAlign='center' as='h2'>Szolgáltatás értékelő</Container>
            <NavigationBar/>
            {props.children}
        </Container>

    );
};
export default Layout;