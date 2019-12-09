import React from 'react';
import {
	MDBIcon,
	MDBNavbar,
	MDBNavbarBrand,
	MDBNavbarNav,
	MDBNavItem,
	MDBNavLink,
	MDBNavbarToggler,
	MDBCollapse,
	MDBFormInline,
	MDBDropdown,
	MDBDropdownToggle,
	MDBDropdownMenu,
	MDBDropdownItem,
} from 'mdbreact';

import rDaiLogo from '../assets/rDai.svg';

class Navbar extends React.Component
{
	state = {
		isOpen: false,
		search: '',
	};

	toggleCollapse()
	{
		this.setState({ isOpen: !this.state.isOpen });
	}

	updateSearch(ev)
	{
		this.setState({ search: ev.target.value });
	}

	submit(event)
	{
		event.preventDefault();
		const address = this.state.search; // TODO: verify address / resolve ENS
		this.props.emitter.emit('goTo', `/nodeview/${address}`);
	}

	render()
	{
		return (
			<MDBNavbar color='black' dark expand='md' fixed='top'>
				<MDBNavbarBrand>
					<img src={rDaiLogo} alt='logo' className='navLogo'/>
					<strong className='white-text'>
					rDai explorer
					</strong>
				</MDBNavbarBrand>
				<MDBNavbarToggler onClick={this.toggleCollapse.bind(this)} />
				<MDBCollapse id='navbarCollapse' isOpen={this.state.isOpen} navbar>
					<MDBNavbarNav left>
						<MDBNavItem>
							<MDBNavLink link to='/Overview'>Overview</MDBNavLink>
						</MDBNavItem>
						<MDBNavItem>
							<MDBNavLink link to='/about-us'>About Us</MDBNavLink>
						</MDBNavItem>
					</MDBNavbarNav>
					<MDBNavbarNav right>
						<MDBNavItem>
							<MDBFormInline waves onSubmit={ this.submit.bind(this) }>
								<div className='md-form my-0'>
									<input type='text' placeholder='Search' aria-label='Search' onChange={ this.updateSearch.bind(this) } className='form-control mr-sm-2'/>
								</div>
							</MDBFormInline>
						</MDBNavItem>
						<MDBNavItem>
							<MDBDropdown>
								<MDBDropdownToggle nav caret>
									<MDBIcon icon="globe" />
								</MDBDropdownToggle>
								<MDBDropdownMenu className="dropdown-default">
									{
										Object.entries(this.props.networks).map(([key, value]) =>
											<MDBDropdownItem
												key={key}
												href="#!"
												onClick={() => this.props.emitter.emit('switchNetwork', key) }
											>
												{key}
											</MDBDropdownItem>
										)
									}
								</MDBDropdownMenu>
							</MDBDropdown>
						</MDBNavItem>
					</MDBNavbarNav>
				</MDBCollapse>
			</MDBNavbar>
		);
	}
}

export default Navbar;
