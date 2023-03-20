import React from "react";
import {Menu} from "semantic-ui-react";
import {Link} from "../routes";

const NavigationBar = () => {
    return (
        <Menu>
            <Link route="/">
                <a className="item">
                    Főoldal
                </a>
            </Link>
            <Link route="/services/new">
                <a className="item">
                    Új szolgáltatás
                </a>
            </Link>
        </Menu>
    );
}

export default NavigationBar;