import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ForceGraph2D } from 'react-force-graph';

// TODO NodeviewGraph
import Loading       from './Loading';

import graphql from '../graphql';

const Overview = (props) => {

	const handleClick = React.useCallback(node => {
		if (node.address)
		{
			props.emitter.emit('goTo', `/nodeview/${node.address}`);
		}
	}, [props]);

	// Query subgraph
	const { data, loading, error } = useQuery(
		graphql.viewNode,
		{
			variables:
			{
				address: props.match.params.address
			}
		}
	);

	// Handle errors
	if (loading)
	{
		return <Loading/>;
	}
	if (error)
	{
		console.error(error);
		return null;
	}

	// format data
	const LinkTotalSize = 10;
	const nodes = [], links = [];


	const outValue = data.account.loansOwned.map(loan => parseFloat(loan.amount)).reduce((x,y) => x+y, 0);
	const inHatsID    = [...new Set(data.account.loansReceived.map(loan => loan.hat.id))];
	const inHatsValue = {};

	for (const loan of data.account.loansReceived)
	{
		inHatsValue[null] |= 0;
		inHatsValue[null] += parseFloat(loan.amount);
		inHatsValue[loan.hat.id] |= 0;
		inHatsValue[loan.hat.id] += parseFloat(loan.amount);
	}

	inHatsValue[null] = Math.max(outValue, inHatsValue[null] | 0)

	// generate
	nodes.push({
		id:      `${data.account.id} (self)`,
		address: data.account.id,
		size:    3,
	});

	if (data.account.loansReceived.length > 0)
	{
		for (const inHatID of inHatsID)
		{
			nodes.push({
				id:    `${inHatID} (inbound hat)`,
				color: '#888888',
				size:  1,
			});

			links.push({
				source: `${inHatID} (inbound hat)`,
				target: `${data.account.id} (self)`,
				label:  `${inHatsValue[inHatID]} rDai`,
				size:   LinkTotalSize * inHatsValue[inHatID] / inHatsValue[null],
			});
		}

		for (const loan of data.account.loansReceived)
		{
			nodes.push({
				id:      `${loan.owner.id} (lender)`,
				address: loan.owner.id,
				color:   '#444444',
				size:    2,
			});

			links.push({
				source: `${loan.owner.id} (lender)`,
				target: `${loan.hat.id} (inbound hat)`,
				label:  `${loan.amount} rDai`,
				size:   LinkTotalSize * loan.amount / inHatsValue[null],
			});
		}
	}

	if (data.account.loansOwned.length > 0)
	{
		const outHatID = data.account.loansOwned.find(Boolean).hat.id;

		nodes.push({
			id:    `${outHatID} (outbound hat)`,
			color: '#888888',
			size:  1,
		});

		links.push({
			source: `${data.account.id} (self)`,
			target: `${outHatID} (outbound hat)`,
			label:  `${outValue} (rDai)`,
			size:   LinkTotalSize * outValue / inHatsValue[null],
		});

		for (const loan of data.account.loansOwned)
		{
			nodes.push({
				id:      `${loan.recipient.id} (recipient)`,
				address: loan.recipient.id,
				color:   '#444444',
				size:    2,
			});

			links.push({
				source: `${outHatID} (outbound hat)`,
				target: `${loan.recipient.id} (recipient)`,
				label:  `${loan.amount} rDai`,
				size:   LinkTotalSize * loan.amount / inHatsValue[null],
			});
		}
	}

	// render
	return (
		<>
			<ForceGraph2D
				graphData                = {{ nodes, links }}
				dagMode                  = 'lr'
				dagLevelDistance         = { 100 }
				nodeLabel                = { n => n.id }
				nodeVal                  = { n => n.size }
				nodeAutoColorBy          = { n => n.group }
				linkLabel                = { n => n.label }
				linkWidth                = { l => l.size }
				linkDirectionalParticles = { 3 }
				onNodeClick               = { (node) => handleClick(node) }
				backgroundColor          = "#FFFFFF"
			/>;
		</>
	);
};

export default Overview;
