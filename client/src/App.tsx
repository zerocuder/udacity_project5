import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditPhoto } from './components/EditPhoto'
import { AddPhoto } from './components/AddPhoto'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Photos } from './components/Photos'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                {this.footer()}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  footer() {
    return (
      <div style={{ textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        Udagram: Cloud Capstone Project - 
        <a className='text-reset fw-bold' href='.'>
        NamLH20
        </a>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.Menu position="right"><Menu.Item>{this.showGreeting()}</Menu.Item></Menu.Menu>
        <Menu.Menu >{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  showGreeting() {
    var hour = new Date().getHours();
    return ("Good " + (hour<12 && "Morning" || hour<18 && "Afternoon" || "Evening") + "!")
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Photos {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/photos/add"
          exact
          render={props => {
            return <AddPhoto {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/photos/:photoId/edit"
          exact
          render={props => {
            return <EditPhoto {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
