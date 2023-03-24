import React, {Component} from "react";
import Layout from "../../components/Layout";
import Service from "../../ethereum/service";
import {Button, Comment, Container, Divider, Form, Icon, Item, Message, Rating, TextArea} from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import {Router} from "../../routes";
import Review from "../../components/Review";
import {loadGetInitialProps} from "next/dist/shared/lib/utils";

class ServiceInfo extends Component {
    state = {
        starRating: 0,
        textRating: '',
        loading: false,
        error: ''
    }

    static async getInitialProps(props) {
        const address = props.query.address;
        const currentService = Service(address);
        const name = await currentService.methods.name().call();
        const description = await currentService.methods.description().call();
        const reviewCount = await currentService.methods.getReviewCount().call();
        const tagged = await currentService.methods.tagged().call();
        const avgRating = await currentService.methods.avgRating().call();

        const reviews = await Promise.all(
            Array(parseInt(reviewCount)).fill().map((element, index) => {
                return currentService.methods.reviews(index).call()
            })
        );

        return {name, description, reviewCount, address: address, reviews, tagged, avgRating};
    }

    onSubmit = async event => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        const currentService = Service(this.props.address);
        this.setState({loading: true, error: ''});

        try {
            const nextAverage = this.averageRating(Number(this.state.starRating));
            if ((this.props.tagged && nextAverage > 3) || (!this.props.tagged && nextAverage < 3)) {
                await currentService.methods.rateAndChangeTag(Number(this.state.starRating), String(this.state.textRating), String(nextAverage)).send({from: accounts[0]});
            } else {
                await currentService.methods.rate(Number(this.state.starRating), String(this.state.textRating), String(nextAverage)).send({from: accounts[0]});
            }
            Router.replaceRoute(`/services/${this.props.address}`)
        } catch (error) {
            this.setState({error: "Hiba történt! Kérjük ellenőrizze az adatokat, majd hagyja jóvá a tranzakciót! Figyelem, egy szolgáltatást felhasználónként csak egyszer lehet értékelni!"})
        }
        this.setState({loading: false})
    }

    averageRating(nextScore) {
        let ratingSum = nextScore;
        const reviewCount = Number(this.props.reviewCount) + 1;
        this.props.reviews?.map((element, index) => {
            ratingSum += Number(element.reviewScore);
        });
        return ratingSum / reviewCount;
    }

    renderReviews() {
        return this.props.reviews?.map((element, index) => {
            return <Review
                key={index}
                review={element}
            />;
        });
    }

    render() {
        return (
            <Layout>
                <Container text>
                    <Container textAlign='center' as='h3'>{this.props.name}</Container>
                    <Container textAlign='center' as='i'>{this.props.avgRating + '/10'} <Icon name='star'/></Container>
                    <Container textAlign='center' as='p'>{this.props.description}</Container>
                    <Container textAlign='center' as='i'><Icon
                        name='comments'/> {this.props.reviewCount} értékelés</Container>
                </Container>
                <Divider horizontal>Értékelés készítése</Divider>
                <Form error={!!this.state.error} onSubmit={this.onSubmit} loading={this.state.loading}>
                    <Form.Field
                        control={Rating}
                        icon='star'
                        maxRating={10}
                        defaultRating={0}
                        label="Csillagos értékelés:"
                        value={this.state.starRating}
                        onRate={(event, {rating, maxRating}) => {
                            this.setState({starRating: rating})
                        }}
                    />
                    <Form.Field
                        control={TextArea}
                        label='Szöveges értékelés:'
                        value={this.state.textRating}
                        onChange={event => this.setState({textRating: event.target.value})}
                    />
                    <Message error header="Hiba" content={this.state.error}/>
                    <Button secondary>Értékelés</Button>
                </Form>
                <Divider horizontal>Értékelések</Divider>
                <Comment.Group>
                    {this.renderReviews()}
                </Comment.Group>
            </Layout>
        );
    }
}

export default ServiceInfo;