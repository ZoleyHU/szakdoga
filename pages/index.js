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
        const sleep = t => new Promise(rs => setTimeout(rs, t));
        const serviceAddresses = await factory.methods.getDeployedServices().call();
        const mostRatedServiceAddress = await factory.methods.getMostRatedService().call();
        let mostRatedService;

        const services = await Promise.all(
            Array(parseInt(serviceAddresses.length)).fill().map((element, index) => {
                return limit(async () => {
                    await sleep(100);
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

    renderServices() {
        const items = this.props.services.map((service, index) => {
            return this.renderSingleService(service);
        });

        return <Card.Group items={items} itemsPerRow={2}/>
    }

    renderSingleService(service) {
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

    renderMostRatedService() {
        if (typeof this.props.mostRatedService === "undefined") {
            return <CardGroup/>
        }
        let item = this.renderSingleService(this.props.mostRatedService);
        item.description = this.props.mostRatedService.reviewCount + " db értékeléssel a legértékeltebb szolgáltatás jelenleg az oldalon";
        const items = [item]
        return <CardGroup items={items}/>
    }

    render() {
        return (
            <Layout>
                <Container textAlign='left' as='h3'>Legtöbbet értékelt szolgáltatás</Container>
                {this.renderMostRatedService()}
                <Container textAlign='left' as='h3'>Szolgáltatások</Container>
                {this.renderServices()}
            </Layout>
        );
    }
}

export default HomePage;