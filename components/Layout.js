import React from "react";
import "semantic-ui-css/semantic.min.css";
import NavigationBar from "./NavigationBar";
import {Container} from "semantic-ui-react";

const Layout = (props) => {
    return (
        <Container>
            <h2>Szolgáltatás értékelő</h2>
            {/*<link*/}
            {/*    async*/}
            {/*    rel="stylesheet"*/}
            {/*    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"*/}
            {/*/>*/}
            <NavigationBar/>
            {props.children}
        </Container>

    );
};
export default Layout;