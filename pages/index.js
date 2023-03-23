import React, {Component} from "react";
import factory from "../ethereum/factory";
import {Button, Card, CardGroup, Container, Divider, Icon} from "semantic-ui-react";
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
                const avgRating = await currentServie.methods.avgRating().call();

                return {
                    serviceAddress: serviceAddresses[index],
                    serviceName: name,
                    tagged: tagged,
                    avgRating: avgRating
                }
            })
        );
        const mostRatedServiceAddress = await factory.methods.getMostRatedService().call();
        const mostRatedService = Service(mostRatedServiceAddress);
        const mostRatedServiceTagged = await mostRatedService.methods.tagged().call();
        const mostRatedServiceName = await mostRatedService.methods.name().call();
        const mostRatedServiceAvgRating = await mostRatedService.methods.avgRating().call();
        const mostRatedServiceDetails = {
            serviceAddress: mostRatedServiceAddress,
            serviceName: mostRatedServiceName,
            tagged: mostRatedServiceTagged,
            avgRating: mostRatedServiceAvgRating
        }
        return {services, mostRatedServiceDetails};
    }

    renderItems() {
        const items = this.props.services.map((service, index) => {
            const color = service.tagged ? 'red' : 'green';
            return {
                header: service.serviceName,
                meta: service.avgRating + '/ 10',
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
                <Container textAlign='left' as='h3'>Legtöbbet értékelt szolgáltatás</Container>
                <Card.Group itemsPerRow={1}>
                    <Card
                        fluid
                        header={this.props.mostRatedServiceDetails.serviceName}
                        meta={this.props.mostRatedServiceDetails.avgRating + '/ 10'}
                        extra={
                            <Link route={`/services/${this.props.mostRatedServiceDetails.serviceAddress}`}>
                                <Button basic color={this.props.mostRatedServiceDetails.tagged ? 'red' : 'green'}>Megtekintés</Button>
                            </Link>
                        }
                        color={this.props.mostRatedServiceDetails.tagged ? 'red' : 'green'}
                    />
                </Card.Group>
                <Container textAlign='left' as='h3'>Szolgáltatások</Container>
                {this.renderItems()}
            </Layout>
        );
    }
}

export default HomePage;