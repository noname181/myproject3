import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Signup from '../screens/SignUp';
import ForgotPassword from '../screens/ForgotPassword';

const Stack = createStackNavigator();

function AuthStack(props) {
    return (
        <Stack.Navigator headerMode={false} initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="ForgotPass" component={ForgotPassword} />
        </Stack.Navigator>
    );
}


export default AuthStack;