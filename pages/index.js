import React, {Component} from "react";
import factory from "../ethereum/factory";
import {Button, Card, Divider} from "semantic-ui-react";
import Layout from "../components/Layout";
import {Link} from "../routes";
import Service from "../ethereum/service";

class HomePage extends Component {
    static async getInitialProps() {
        const serviceAddresses = await factory.methods.getDeployedServices().call();

        const services = await Promise.all(
            Array(parseInt(serviceAddresses.length)).fill().map(async (element, index) => {
                const currentServie = Service(serviceAddresses[index]);
                const name = await currentServie.methods.name().call();
                const tagged = await currentServie.methods.tagged().call();

                return {
                    serviceAddress: serviceAddresses[index],
                    serviceName: name,
                    tagged: tagged
                }
            })
        );

        return {services};
    }

    renderItems() {
        const items = this.props.services.map((service, index) => {
            const color = service.tagged ? 'red' : 'green';
            return {
                header: service.serviceName,
                extra: (
                    <Link route={`/services/${service.serviceAddress}`}>
                        <Button basic color={color}>Megtekintés</Button>
                    </Link>
                ),
                color: color,
                fluid: true
            };
        });

        return <Card.Group items={items} itemsPerRow={2}/>
    }

    render() {
        return (
            <Layout>
                <h3>Szolgáltatások</h3>
                {this.renderItems()}
            </Layout>
        );
    }
}

export default HomePage;