import React from 'react';
import {Switch,Route} from 'react-router-dom';

import Dashboard from './app/views/Dashboard/index';
import Home from './app/views/Home/index';
import Signup from './app/views/Signup/index';
import CreateRecipe from './app/views/CreateRecipe/index';

const Routes = () =>  (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={()=><h1>Login</h1>} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/edit" component={()=><h1>User Edit</h1>} />
        <Route exact path="/createrecipe" component={CreateRecipe}  />
    </Switch>
)

export default Routes