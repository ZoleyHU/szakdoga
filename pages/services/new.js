import React, {Component} from "react";
import {Form, Button, TextArea, Input, Message} from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

class NewService extends Component {
    state = {
        name: '',
        description: '',
        loading: false,
        error: '',
        success: ''
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        this.setState({loading: true, error: '', success: ''});

        try {
            await factory.methods.createService(String(this.state.name),String(this.state.description)).send({
                from: accounts[0]
            });
            this.setState({success: 'Szolgáltatás sikeresen hozzáadva!'});
        } catch (error) {
            this.setState({error: "Hiba történt! Kérjük ellenőrizze az adatokat, majd hagyja jóvá a tranzakciót!"})
        }
        this.setState({loading: false})
    };

    render() {
        return (
            <Layout>
                <h3>Új szolgáltatás hozzáadása</h3>
                <Form error={!!this.state.error} success={!!this.state.success} onSubmit={this.onSubmit} loading={this.state.loading}>
                    <Form.Field
                        control={Input}
                        label='Szolgáltatás neve:'
                        placeholder='Név'
                        value={this.state.name}
                        onChange={event => this.setState({name: event.target.value})}
                    />
                    <Form.Field
                        control={TextArea}
                        label='Szolgáltatás leírása:'
                        placeholder='Leírás'
                        value={this.state.description}
                        onChange={event => this.setState({description: event.target.value})}
                    />
                    <Message error header="Hiba" content={this.state.error}/>
                    <Message success header="Siker" content={this.state.success}/>
                    <Button secondary>Hozzáadás</Button>
                </Form>
            </Layout>
        );
    }
}

export default NewService;