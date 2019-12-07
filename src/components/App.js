import React from 'react';
import { MemoryRouter as Router, Route, Redirect } from 'react-router-dom';

import Navbar from './Navbar';
import Core   from './Core';

import config from '../config';

class App extends React.Component
{
	render()
	{
		return (
			<Router>
				<Navbar networks={config.networks} />
				<Redirect from="/" to={ `/explorer/${Object.keys(config.networks).find(Boolean)}` } />
				<Route exact path="/about-us"          render={ (props) => <p>AboutUs</p> } />
				<Route exact path="/explorer/:network" render={ (props) => <Core {...props}/> } />
			</Router>
		);
	}
};

export default App;
