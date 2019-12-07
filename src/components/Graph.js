import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import GraphView from './GraphView';

import graphql from '../graphql';

const Graph = (props) => {
	// const [ state ] = React.useState({ node: null, modal: true });
	const zoomCallback  = null; //React.useCallback(node => { state.node = node; }, [state]);
	const resetCallback = null; //React.useCallback(()   => { state.node = null; }, [state]);

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
	if (loading) { return `Loading`;         }
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
		<GraphView
			data          = {{ nodes, links }}
			zoomCallback  = { zoomCallback }
			resetCallback = { resetCallback }
		/>
	);
};

export default Graph;
