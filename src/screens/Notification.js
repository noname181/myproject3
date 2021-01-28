import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableHighlight,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Screen from '../components/Screen';
import Header from '../components/Header';
import { SwipeListView } from 'react-native-swipe-list-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyStatusBar from '../components/MyStatusBar';

function Notification(props) {
    const [listData, setListData] = useState(
        Notifications.map((NotificationItem, index) => ({
            key: `${index}`,
            title: NotificationItem.title,
            details: NotificationItem.details,
        })),
    );

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
    };

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    const onLeftActionStatusChange = rowKey => {
        console.log('onLeftActionStatusChange', rowKey);
    };

    const onRightActionStatusChange = rowKey => {
        console.log('onRightActionStatusChange', rowKey);
    };

    const onRightAction = rowKey => {
        console.log('onRightAction', rowKey);
    };

    const onLeftAction = rowKey => {
        console.log('onLeftAction', rowKey);
    };

    const VisibleItem = props => {
        const {
            data,
            rowHeightAnimatedValue,
            removeRow,
            leftActionState,
            rightActionState,
        } = props;

        if (rightActionState) {
            Animated.timing(rowHeightAnimatedValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start(() => {
                removeRow();
            });
        }

        return (
            <Animated.View
                style={[styles.rowFront, { height: rowHeightAnimatedValue }]}>
                <TouchableOpacity
                    style={styles.rowFrontVisible}
                    onPress={() => console.log('Element touched')}
                    underlayColor={'#aaa'}>
                    <View style={{ height: '100%', alignItems: 'center', flexDirection: 'row' }}>
                        <Ionicons name="ios-notifications" size={60} color="#f75f2d" />
                        <View style={{ flex: 1, paddingHorizontal: 10 }}>
                            <Text style={styles.title} numberOfLines={1}>
                                {data.item.title}
                            </Text>
                            <Text style={styles.details} numberOfLines={1}>
                                {data.item.details}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderItem = (data, rowMap) => {
        const rowHeightAnimatedValue = new Animated.Value(80);

        return (
            <VisibleItem
                data={data}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                removeRow={() => deleteRow(rowMap, data.item.key)}
            />
        );
    };

    const HiddenItemWithActions = props => {
        const {
            swipeAnimatedValue,
            leftActionActivated,
            rightActionActivated,
            rowActionAnimatedValue,
            rowHeightAnimatedValue,
            onClose,
            onDelete,
        } = props;

        if (rightActionActivated) {
            Animated.spring(rowActionAnimatedValue, {
                toValue: 500,
                useNativeDriver: false
            }).start();
        } else {
            Animated.spring(rowActionAnimatedValue, {
                toValue: 75,
                useNativeDriver: false
            }).start();
        }

        return (
            <Animated.View style={[styles.rowBack, { height: rowHeightAnimatedValue }]}>
                <Text>Left</Text>
                {/* {!leftActionActivated && (
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnLeft]}
                        onPress={onClose}>
                        <MaterialCommunityIcons
                            name="close-circle-outline"
                            size={25}
                            style={styles.trash}
                            color="#fff"
                        />
                    </TouchableOpacity>
                )} */}
                {!leftActionActivated && (
                    <Animated.View
                        style={[
                            styles.backRightBtn,
                            styles.backRightBtnRight,
                            {
                                flex: 1,
                                width: rowActionAnimatedValue,
                            },
                        ]}>
                        <TouchableOpacity
                            style={[styles.backRightBtn, styles.backRightBtnRight]}
                            onPress={onDelete}>
                            <Animated.View
                                style={[
                                    styles.trash,
                                    {
                                        transform: [
                                            {
                                                scale: swipeAnimatedValue.interpolate({
                                                    inputRange: [-90, -45],
                                                    outputRange: [1, 0],
                                                    extrapolate: 'clamp',
                                                }),
                                            },
                                        ],
                                    },
                                ]}>
                                <MaterialCommunityIcons
                                    name="trash-can-outline"
                                    size={25}
                                    color="#fff"
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </Animated.View>
        );
    };
    const renderHiddenItem = (data, rowMap) => {
        const rowActionAnimatedValue = new Animated.Value(75);
        const rowHeightAnimatedValue = new Animated.Value(60);

        return (
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
                rowActionAnimatedValue={rowActionAnimatedValue}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                onClose={() => closeRow(rowMap, data.item.key)}
                onDelete={() => deleteRow(rowMap, data.item.key)}
            />
        );
    };

    return (
        <Screen style={styles.container}>
            <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Header isHome={true}>Hộp thư</Header>
            <SwipeListView
                style={{ paddingTop: 15 }}
                data={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                //Phần kéo ra khi vuốt từ phải qua trái lần đầu
                rightOpenValue={-75}
                disableRightSwipe
                onRowDidOpen={onRowDidOpen}
                leftActivationValue={100}
                //Kéo 500px từ phải qua trái để thực hiện action
                rightActivationValue={-500}
                leftActionValue={0}
                rightActionValue={-500}
                onLeftAction={onLeftAction}
                onRightAction={onRightAction}
                onLeftActionStatusChange={onLeftActionStatusChange}
                onRightActionStatusChange={onRightActionStatusChange}
            />
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rowFront: {
        backgroundColor: '#FFF',
        borderRadius: 0,
        height: 80,
        marginVertical: 5,
        marginBottom: 15,
        shadowColor: '#e6e6e6',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 2,
    },
    rowFrontVisible: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        height: 80,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    //CSS phần background phía sau
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        marginVertical: 5,
        marginBottom: 15,
        // borderRadius: 5,
    },
    backRightBtn: {
        alignItems: 'flex-end',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        paddingRight: 17,
    },
    backRightBtnLeft: {
        backgroundColor: '#1f65ff',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        // borderTopRightRadius: 5,
        // borderBottomRightRadius: 5,
    },
    trash: {
        height: 25,
        width: 25,
        marginRight: 7,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
    },
    details: {
        fontSize: 12,
        color: '#999',
    }
});

export default Notification;

const Notifications = [
    {
        id: 1,
        title: 'Your pizza order placed successfully',
        details: 'Your pizza order to snack corner has been accepted and being processed.'
    },
    {
        id: 2,
        title: 'Your bengali thali order has been delivered',
        details: 'Your bengali thali has been delivered by Delicious Bong Recipe.'
    },
    {
        id: 3,
        title: 'Out for delivery',
        details: 'Bengali thali will reach to you within 30 minutes.'
    },
    {
        id: 4,
        title: 'Your bengali thali order placed successfully',
        details: 'Your bengali thali order to Delicious Bong Recipe has been accepted and being processed.'
    },
    {
        id: 5,
        title: 'Money added to your wallet',
        details: '₹ 1,000/- has been added to your wallet successfully and remaining balance is ₹ 1,150/-'
    },
    {
        id: 6,
        title: 'Add money to your wallet',
        details: 'Only ₹ 150/- is left in your wallet. Add some more amount to place your order quickly.'
    },
    {
        id: 7,
        title: 'Check new Pizza Corner within 1 km',
        details: 'A new Pizza Corner is being loved by more people around you.'
    },
    {
        id: 8,
        title: 'Check new Roll Center within 3 km',
        details: 'A new roll center is being loved by more people around you.'
    },
    {
        id: 9,
        title: 'Check new Crispy Chicken within 3 km',
        details: 'A new Crispy Chicken is being loved by more people around you.'
    },
    {
        id: 10,
        title: 'Check new Snacks Corner within 5 km',
        details: 'A new Snacks Corner is being loved by more people around you.'
    },
];
