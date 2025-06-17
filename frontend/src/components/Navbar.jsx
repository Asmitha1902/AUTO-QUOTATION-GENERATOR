import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Navbar.css';

const Navbar = ({ username }) => {
  return (
    <>
      <Helmet>
        {/* External CSS Libraries */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css" />
        <link rel="stylesheet" href="https://cdn.datatables.net/1.10.7/css/jquery.dataTables.css" />
        <link rel="stylesheet" href="https://cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.css" />
        <style>{`
          @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');
          body, h1, h2, h3, h4, h5, h6 {
            font-family: 'Open Sans', sans-serif;
          }
        `}</style>
      </Helmet>

      <header className="main-header">
        <Link to="/" className="logo">
          <span className="logo-mini"><b>IN</b>MS</span>
          <span className="logo-lg"><b>Invoice</b> System</span>
        </Link>

        <nav className="navbar navbar-static-top">
          <a href="#" className="sidebar-toggle" role="button">
            <span className="sr-only">Toggle navigation</span>
          </a>
          <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              <li className="dropdown user user-menu">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <img src="https://pcrt.crab.org/images/default-user.png" className="user-image" alt="User" />
                  <span className="hidden-xs">{username || 'Guest'}</span>
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/logout" className="btn btn-default btn-flat">Log out</Link></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <aside className="main-sidebar">
        <section className="sidebar">
          <ul className="sidebar-menu">
            <li className="header">MENU</li>

            <li><Link to="/"><i className="fa fa-tachometer"></i> <span>Dashboard</span></Link></li>

            <li className="treeview">
              <a href="#"><i className="fa fa-file-text"></i> <span>Invoices</span><i className="fa fa-angle-left pull-right"></i></a>
              <ul className="treeview-menu">
                <li><Link to="/invoices/create"><i className="fa fa-plus"></i> Create Invoice</Link></li>
                <li><Link to="/invoices"><i className="fa fa-cog"></i> Manage Invoices</Link></li>
              </ul>
            </li>

            <li className="treeview">
              <a href="#"><i className="fa fa-archive"></i><span>Products</span><i className="fa fa-angle-left pull-right"></i></a>
              <ul className="treeview-menu">
                <li><Link to="/products/add"><i className="fa fa-plus"></i> Add Products</Link></li>
                <li><Link to="/products"><i className="fa fa-cog"></i> Manage Products</Link></li>
              </ul>
            </li>

            <li className="treeview">
              <a href="#"><i className="fa fa-users"></i><span>Customers</span><i className="fa fa-angle-left pull-right"></i></a>
              <ul className="treeview-menu">
                <li><Link to="/customers/add"><i className="fa fa-user-plus"></i> Add Customer</Link></li>
                <li><Link to="/customers"><i className="fa fa-cog"></i> Manage Customers</Link></li>
              </ul>
            </li>

            <li className="treeview">
              <a href="#"><i className="fa fa-user"></i><span>System Users</span><i className="fa fa-angle-left pull-right"></i></a>
              <ul className="treeview-menu">
                <li><Link to="/users/add"><i className="fa fa-plus"></i> Add User</Link></li>
                <li><Link to="/users"><i className="fa fa-cog"></i> Manage Users</Link></li>
              </ul>
            </li>

          </ul>
        </section>
      </aside>
    </>
  );
};

export default Navbar;
