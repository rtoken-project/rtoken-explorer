import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ForceGraph2D } from 'react-force-graph';

import graphql from '../graphql';

const App = (props) => {
	// const fgRef = React.useRef();

	// Query subgraph
	const { data, loading, error } = useQuery(
		graphql.viewNodes,
		{
			variables:
			{
				address: props.address
			}
		}
	)

	// Handle errors
	if (loading) { return null;              }
	if (error  ) { return `Error! ${error}`; }

	// Format data
	const nodes = data.accounts.map(account => ({
		id:      account.id,
		balance: account.balance,
		size:    Math.log(1+account.balance),
		color:   "#CCCCCC",
	}))

	const links = [].concat(
		...data.accounts.map(account => ([
			...account.loansOwned.map(loan => ({
				source: account.id,
				target: loan.recipient.id,
				amount: loan.amount,
				size:   Math.log(loan.amount),
				// color:   "#CCCCCC",
			})),
			...account.loansReceived.map(loan => ({
				source:  loan.owner.id,
				target:  account.id,
				amount:  loan.amount,
				size:    Math.log(loan.amount),
				// color:   "#CCCCCC",
			})),
		]))
	)

	// render
	return <ForceGraph2D
		graphData={{ nodes, links }}
		nodeLabel="id"
		nodeVal="size"
		linkDirectionalParticles="size"
		linkCurvature={ 0.5 }
	/>;
};

export default App;
