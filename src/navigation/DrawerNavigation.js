import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from '../navigation/DrawerContent';
import TabNavigation from './TabNavigation';

const Drawer = createDrawerNavigator();
const width = Dimensions.get('window').width;

function DrawerNavigation(props) {
    const [showDrawer, setShowDrawer] = useState(false);

    setTimeout(() => { setShowDrawer(true) }, 500);

    return (

        <Drawer.Navigator
            drawerContent={props => <DrawerContent {...props} />}
            drawerContentOptions={{
                activeBackgroundColor: '#f75f2d',
                activeTintColor: '#ffffff',
                contentContainerStyle: { margin: -10 },
            }}
            initialRouteName="Tab"
            drawerStyle={{ width: !showDrawer ? null : width * 0.7 }}

        >
            <Drawer.Screen name="Tab" component={TabNavigation} />
        </Drawer.Navigator>
    );
}

export default DrawerNavigation;
