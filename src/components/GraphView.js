import React from 'react';
import { ForceGraph3D } from 'react-force-graph';

const GraphView = (props) => {
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
		props.zoomCallback && props.zoomCallback(node);
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
			props.resetCallback && props.resetCallback();
		}
	}, [fgRef, state]);

	// render
	return <ForceGraph3D
		ref                               = { fgRef }
		graphData                         = { props.data }
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
}

export default GraphView;
