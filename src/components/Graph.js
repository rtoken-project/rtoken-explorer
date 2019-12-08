import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { EventEmitter } from 'fbemitter';

import GraphView from './GraphView';
import SideView  from './SideView';
import Loading   from './Loading';

import graphql from '../graphql';

const Graph = (props) => {
	const emitter = new EventEmitter();

	// Query subgraph
	const { data, loading, error } = useQuery(
		graphql.viewNodes,
		{
			variables:
			{
				address: props.address
			}
		}
	);

	// Handle errors
	if (loading) { return <Loading/>;        }
	if (error  ) { return `Error! ${error}`; }

	// Format data - nodes
	const nodes = data.accounts.map(account => ({
		id:      account.id,
		balance: account.balance,
		group:   (account.loansOwned.length > 0 ? 0x1 : 0x0) | (account.loansReceived.length > 0 ? 0x2 : 0x0),
		details: account,
		// color:   "#CCCCCC",
	}));

	// Format data - links
	const links = [].concat(
		...data.accounts.map(account =>
			account.loansOwned.map(loan => ({
				source:  account.id,
				target:  loan.recipient.id,
				amount:  loan.amount,
				details: loan,
				// color:   "#CCCCCC",
			})),
		)
	);

	// render
	return (
		<>
			<GraphView
				data    = {{ nodes, links }}
				emitter = { emitter }
			/>
			<SideView
				emitter = { emitter }
			/>
		</>
	);
};

export default Graph;
