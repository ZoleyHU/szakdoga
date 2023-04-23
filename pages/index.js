import React, {Component} from "react";
import factory from "../ethereum/factory";
import {Button, Card, CardGroup, Container} from "semantic-ui-react";
import Layout from "../components/Layout";
import {Link} from "../routes";
import Service from "../ethereum/service";
import pLimit from "p-limit";

class HomePage extends Component {
    static async getInitialProps() {
        const limit = pLimit(4);
        const serviceAddresses = await factory.methods.getDeployedServices().call();
        const mostRatedServiceAddress = await factory.methods.getMostRatedService().call();
        let mostRatedService;

        const services = await Promise.all(
            Array(parseInt(serviceAddresses.length)).fill().map(async (element, index) => {
                return limit(async () => {
                    const currentServie = Service(serviceAddresses[index]);
                    const name = await currentServie.methods.name().call();
                    const tagged = await currentServie.methods.tagged().call();
                    const avgRating = await currentServie.methods.avgRating().call();

                    if (serviceAddresses[index] === mostRatedServiceAddress) {
                        const reviews = await currentServie.methods.getReviewCount().call();

                        mostRatedService = {
                            serviceAddress: serviceAddresses[index],
                            serviceName: name,
                            tagged: tagged,
                            avgRating: avgRating,
                            reviewCount: reviews
                        }
                    }

                    return {
                        serviceAddress: serviceAddresses[index],
                        serviceName: name,
                        tagged: tagged,
                        avgRating: avgRating
                    }
                })
            })
        );
        return {services, mostRatedService};
    }

    renderItems() {
        const items = this.props.services.map((service, index) => {
            return this.renderSingleItem(service);
        });

        return <Card.Group items={items} itemsPerRow={2}/>
    }

    renderSingleItem(service) {
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
    }

    renderMostRatedItem() {
        let item = this.renderSingleItem(this.props.mostRatedService);
        item.description = this.props.mostRatedService.reviewCount + " db értékeléssel a legértékeltebb szolgáltatás jelenleg az oldalon";
        const items = [item]
        return <CardGroup items={items}/>
    }

    render() {
        return (
            <Layout>
                <Container textAlign='left' as='h3'>Legtöbbet értékelt szolgáltatás</Container>
                {this.renderMostRatedItem()}
                <Container textAlign='left' as='h3'>Szolgáltatások</Container>
                {this.renderItems()}
            </Layout>
        );
    }
}

export default HomePage;