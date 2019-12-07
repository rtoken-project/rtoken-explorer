import React from 'react';
import {
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
	MDBDropdownItem
} from 'mdbreact';

import rDaiLogo from '../assets/rDai.svg';

class Navbar extends React.Component
{
	state = {
		isOpen: true
	};

	toggleCollapse()
	{
		this.setState({ isOpen: !this.state.isOpen });
	}

	render()
	{
		// <img src={rDaiLogo} alt="logo" />
		return (
			<MDBNavbar color="black" dark expand="md">
				<MDBNavbarBrand>
					<strong className="white-text">rDai explorer</strong>
				</MDBNavbarBrand>
				<MDBNavbarToggler onClick={this.toggleCollapse} />
				<MDBCollapse id="navbarCollapse" isOpen={this.state.isOpen} navbar>
					<MDBNavbarNav left>
						<MDBNavItem>
							<MDBDropdown>
								<MDBDropdownToggle nav caret>
									<span className="mr-2">Network</span>
								</MDBDropdownToggle>
								<MDBDropdownMenu>
									{
										Object.entries(this.props.networks).map(([key, value]) =>
											<MDBNavLink key={key} link to={ `/explorer/${key}` } className="p-0">
												<MDBDropdownItem>
													{key}
												</MDBDropdownItem>
											</MDBNavLink>
										)
									}
								</MDBDropdownMenu>
							</MDBDropdown>
						</MDBNavItem>
						<MDBNavItem>
							<MDBNavLink link to="/about-us">About Us</MDBNavLink>
						</MDBNavItem>
					</MDBNavbarNav>
					<MDBNavbarNav right>
						<MDBNavItem>
							<MDBFormInline waves>
								<div className="md-form my-0">
									<input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
								</div>
							</MDBFormInline>
						</MDBNavItem>
					</MDBNavbarNav>
				</MDBCollapse>
			</MDBNavbar>
		);
	}
}

export default Navbar;
