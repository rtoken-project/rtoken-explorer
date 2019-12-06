import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ForceGraph3D } from 'react-force-graph';

import graphql from '../graphql';



const App = (props) => {

	const fgRef     = React.useRef();
	const [ state ] = React.useState({ anchor: null });

	// Zoom view
	const handleZoom = React.useCallback(node => {
		// save previous viewpoint
		if (!state.anchor)
		{
			state.anchor = fgRef.current.cameraPosition();
		}
		// move camera
		const distRatio = 1 + 50 / Math.hypot(node.x, node.y, node.z);
		fgRef.current.cameraPosition(
			{ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
			{ x: node.x,             y: node.y,             z: node.z             },
			1000
		);
		// print details
		console.log(`=== Node details ===`)
		console.log(`address: ${node.id}`)
		console.log(`balance: ${node.details.balance} rDai`)
		for (const loan of node.details.loansOwned)
		{
			console.log(`- loan to: ${loan.recipient.id} - ${loan.amount} rDai`)
		}
		for (const loan of node.details.loansReceived)
		{
			console.log(`- loan from: ${loan.owner.id} - ${loan.amount} rDai`)
		}
	}, [fgRef, state]);

	// Reset view
	const handleReset = React.useCallback(e => {
		if (state.anchor)
		{
			fgRef.current.cameraPosition(
				{ x: state.anchor.x, y: state.anchor.y, z: state.anchor.z },
				state.anchor.lookAt,
				1000
			);
			state.anchor = null;
		}
	}, [fgRef, state])

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

	// Format data - nodes
	const nodes = data.accounts.map(account => ({
		id:      account.id,
		balance: account.balance,
		group:   (account.loansOwned.length > 0 ? 0x1 : 0x0) | (account.loansReceived.length > 0 ? 0x2 : 0x0),
		details: account,
		// color:   "#CCCCCC",
	}))

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
	)

	// render
	return <ForceGraph3D
		ref                               = {fgRef}
		graphData                         = {{ nodes, links }}
		enableNodeDrag                    = {false}
		nodeLabel                         = { n => n.id }
		nodeVal                           = { n => Math.log(1+n.balance) }
		nodeAutoColorBy                   = { n => n.group }
		nodeOpacity                       = { 1 }
		nodeResolution                    = { 16 }
		linkCurvature                     = { 0.5 }
		// linkWidth                         = { l => Math.log(1+l.amount) }
		linkDirectionalParticles          = { l => Math.log(1+l.amount) }
		linkDirectionalParticleWidth      = { l => Math.log(1+Math.log(1+l.amount)) }
		linkDirectionalParticleResolution = { 8 }
		onNodeClick                       = { handleZoom }
		onLinkClick                       = { handleReset }
		onBackgroundClick                 = { handleReset }
	/>;
};

export default App;
