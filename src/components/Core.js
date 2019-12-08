import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient   } from 'apollo-client';
import { InMemoryCache  } from 'apollo-cache-inmemory';
import { HttpLink       } from 'apollo-link-http';

import Graph from './Graph';

import config from '../config';

class Core extends React.Component
{
	state = {
		client:   null,
	}

	componentDidMount()
	{
		this.componentWillReceiveProps(this.props);
	}

	componentWillReceiveProps(newProps)
	{
		const uri    = config.networks[newProps.match.params.network].endpoint;
		const cache  = new InMemoryCache();
		const link   = new HttpLink({ uri });
		const client = new ApolloClient({ cache, link });
		this.setState({ client });
	}

	render()
	{
		return (
			this.state.client
			?
				<ApolloProvider client={this.state.client}>
					<Graph/>
				</ApolloProvider>
			:
				<div className='core'>Loading</div>
		);
	}
}

export default Core;
