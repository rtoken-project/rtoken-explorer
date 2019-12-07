import React from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';


const Modal = (props) => {
	const [ state ] = React.useState({ node: null, modal: true });

	const toggle = () => {
		state.model = !state.modal;
	}

	// render
	return (
		<MDBModal isOpen={state.modal} fullHeight position='right'>
			<MDBModalHeader >MDBModal title</MDBModalHeader>
			<MDBModalBody>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
				magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
				consequat.
			</MDBModalBody>
		</MDBModal>
	);
};

export default Modal;
