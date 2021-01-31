import React, { useEffect, useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Login from '../screens/Login'
import Map from '../screens/Map'
import Notification from '../screens/Notification'
import Wishlist from '../screens/Wishlist'
import Account from '../screens/Account'
import HomeStack from './HomeStack'
import { CommonActions } from '@react-navigation/native'
import AuthContext from '../hooks/AuthContext'
import AuthStack from '../navigation/AuthStack'
import { useNavigationState } from '@react-navigation/native'

const Tab = createBottomTabNavigator()

function TabNavigation({ route, navigation }) {
    const authContext = useContext(AuthContext)
    const statee = useNavigationState(state => state)


    useEffect(() => {
        return () => {

        }
    }, [])

    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#f75f2d',
                inactiveTintColor: 'rgb(212,212,212)',
                style: {
                    height: 55,
                },
                tabStyle: {
                    flex: 1,
                },
                showLabel: false
            }}
            initialRouteName="Home"

        >
            <Tab.Screen
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault()
                        navigation.navigate("Main")
                    }
                }}
                name="Home"
                component={HomeStack}
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="home" size={25} color={color}></Ionicons>
                }}
            >
            </Tab.Screen>
            <Tab.Screen
                name="Wishlist"
                component={Wishlist}
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="heart" size={25} color={color}></Ionicons>
                }}
            >
            </Tab.Screen>
            <Tab.Screen
                name="Notification"
                component={Notification}
                options={{
                    tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name="bell" size={25} color={color}></MaterialCommunityIcons>,
                    tabBarBadge: 3
                }}
            >
            </Tab.Screen>
            <Tab.Screen
                name="Map"
                component={Map}
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="map" size={25} color={color}></Ionicons>

                }}
            >

            </Tab.Screen>
            {
                authContext.user ? <Tab.Screen
                    name="Account"
                    component={Account}
                    options={{
                        tabBarIcon: ({ size, color }) => <FontAwesome name="user" size={25} color={color}></FontAwesome>
                    }}
                >
                </Tab.Screen> : <Tab.Screen
                    name="Auth"
                    component={AuthStack}
                    options={{
                        tabBarIcon: ({ size, color }) => <FontAwesome name="user" size={25} color={color}></FontAwesome>
                    }}
                >
                    </Tab.Screen>
            }

        </Tab.Navigator>
    )
}


export default TabNavigation
