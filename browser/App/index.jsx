import React from 'react';
import { connect } from 'react-redux';
import Login from '../Login/index.jsx';
import Logout from '../Logout/index.jsx';
import Chat from '../Chat/index.jsx';
import Sidebar from '../Sidebar/index.jsx';

export const App = ({ user, children }) => (
  <div style={{ backgroundColor: 'blue', height: '200px' }}>
    {user ? <Logout /> : <Login /> }
    {user && <Sidebar style={{ backgroundColor: 'green', height: '200px' }} />}
    {user && children }
  </div>
);

const mapStateToProps = (state) => ({ user: state.auth });

export default connect(mapStateToProps)(App);
