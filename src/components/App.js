import React from 'react';
import { MemoryRouter as Router, Route, Redirect } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient   } from 'apollo-client';
import { InMemoryCache  } from 'apollo-cache-inmemory';
import { HttpLink       } from 'apollo-link-http';
import { EventEmitter } from 'fbemitter';

import Navbar   from './Navbar';
import Overview from './Overview';

import config from '../config';

class App extends React.Component
{
	state = {
		emitter: new EventEmitter(),
		client:  null,
	}

	componentDidMount()
	{
		this.subscription = this.state.emitter.addListener('switchNetwork', this.connect.bind(this));
		this.connect(Object.keys(config.networks).find(Boolean));
	}

	componentWillUnmount()
	{
		this.subscription.remove();
	}

	connect(network)
	{
		console.log("switchNetwork to ", network);
		const uri    = config.networks[network].endpoint;
		const cache  = new InMemoryCache();
		const link   = new HttpLink({ uri });
		const client = new ApolloClient({ cache, link });
		this.setState({ client });
	}

	render()
	{
		return (
			this.state.client &&
			<ApolloProvider client={this.state.client}>
				<Router>
					<Navbar emitter={this.state.emitter} networks={config.networks} />
					<Redirect from="/" to="overview" />
					<Route exact path="/about-us" render={ (props) => <div className='core'>About us</div> } />
					<Route exact path="/overview" render={ (props) => <Overview emitter={this.state.emitter} {...props}/> } />
				</Router>
			</ApolloProvider>
		);
	}
};

export default App;
