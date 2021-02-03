import React from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import Main from '../screens/Main'
import Detail from '../screens/Detail'
import Store from '../screens/Store'
import ProductDetail from '../screens/ProductDetail'
import Cart from '../screens/Cart'
import Test from '../screens/Test'
import GoogleAutocomplete from '../screens/GoogleAutocomplete'
const Stack = createStackNavigator()

const HomeStack = () => (
    <Stack.Navigator headerMode={false} screenOptions={{
        gestureEnabled: false,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    }}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="Store" component={Store} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="GoogleAutocomplete" component={GoogleAutocomplete} />
        <Stack.Screen name="Test" component={Test} />
    </Stack.Navigator>
)

export default HomeStack
