import React from 'react';
import {Switch,Route} from 'react-router-dom';

import Dashboard from './app/views/Dashboard/index';
import Home from './app/views/Home/index';
import Signup from './app/views/Signup/index';
import Login from './app/views/Login/index';
import EditUser from './app/views/EditUser/index';
import EditRecipe from './app/views/EditRecipe/index';
import ChangePassword from './app/views/ChangePassword/index';
import CreateRecipe from './app/views/CreateRecipe/index';
import ViewRecipe from './app/views/ViewRecipe/index';
import Contacto from './app/views/Contacto/index';

const Routes = () =>  (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/edit" component={EditUser} />
        <Route exact path="/changepassword" component={ChangePassword} />
        <Route exact path="/createrecipe" component={CreateRecipe}  />
        <Route exact path="/recipe/:id" component={ViewRecipe} />
        <Route exact path="/editrecipe/:id" component={EditRecipe} />
        <Route exact path="/contacto" component={Contacto} />
    </Switch>
)

export default Routes