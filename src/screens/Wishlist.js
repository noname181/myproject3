import React, { useRef, useEffect, useState, useContext } from "react";
import {
    Animated,
    View,
    StyleSheet,
    Text,
    FlatList,
    PanResponder,
} from "react-native";
import Screen from '../components/Screen';
import Header from '../components/Header';
import { color } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyStatusBar from '../components/MyStatusBar';
import { connect } from 'react-redux'
import AuthContext from '../hooks/AuthContext';
import FoodItemVertical from '../components/FoodItemVertical'

var scrollOffset = 0;
var flatlistTopOffset = 0;
var rowHeight = 0;
var currentIdx = -1;
var currentY = 0;
var active = false;
var flatlistHeight = 0;

function Wishlist(props) {
    const [dragging, Setdragging] = useState(false);
    const [draggingIdx, SetdraggingIdx] = useState(-1);
    const [data, setData] = useState(dataTest);
    const point = useRef(new Animated.ValueXY()).current;
    const flatlist = useRef();
    const authContext = useContext(AuthContext);


    useEffect(() => {
        return () => { }
    }, []);
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (evt) => true,
            onMoveShouldSetPanResponder: (evt) => true,
            onPanResponderGrant: (evt, gestureState) => {
                currentIdx = yToIndex(gestureState.y0);
                currentY = gestureState.y0;
                Animated.event([{ y: point.y }], {
                    useNativeDriver: false,
                    listener: (evt) => { }
                })({ y: gestureState.y0 - rowHeight / 2 });
                active = true;
                let config = async () => {
                    await Setdragging(true);
                    await SetdraggingIdx(currentIdx);
                    animateList();
                }
                config();
            },
            onPanResponderMove: (evt, gestureState) => {
                currentY = gestureState.moveY;
                Animated.event([{ y: point.y }], {
                    useNativeDriver: false,
                    listener: (evt) => { }
                })({ y: gestureState.moveY - rowHeight / 2 });
            },
            onPanResponderRelease: () => {
                reset();
            },
            onPanResponderTerminate: (evt, gestureState) => {
                reset();
            },
            onPanResponderTerminationRequest: (evt, gestureState) => false
        })
    ).current;

    const renderItem = ({ item, index }, noPanResponder = false) =>
        <FoodItemVertical
            key={index}
            name={item.name}
            description={item.description}
            image={item.banner}
            distance={item.distance}
            promo={item.promo}
            type={'store'}
            id={item._id}
        />
    // <View
    //     style={[styles.item, {
    //         backgroundColor: color[item],
    //         opacity: draggingIdx === index ? 0 : 1
    //     }]}
    //     onLayout={e => {
    //         rowHeight = e.nativeEvent.layout.height;
    //     }}
    // >
    //     <View style={{ marginLeft: 20, height: '100%', width: 40, justifyContent: 'center' }} {...(noPanResponder ? {} : panResponder.panHandlers)}>
    //         <MaterialCommunityIcons name="drag" size={25} color="#fff" />
    //     </View>
    //     <Text style={{
    //         color: '#fff',
    //         fontSize: 20,
    //         fontWeight: 'bold',
    //         flex: 0.85,
    //         textAlign: 'center',

    //     }}>{item}</Text>
    // </View>


    const reset = () => {
        active = false;
        Setdragging(false);
        SetdraggingIdx(-1);
    }

    const yToIndex = (number) => {
        const value = Math.floor(
            (scrollOffset + number - flatlistTopOffset) / rowHeight
        );

        if (value < 0) {
            return 0;
        }

        if (value > data.length - 1) {
            return data.length - 1;
        }

        return value;
    };
    animateList = () => {
        if (!active) {
            return;
        }
        requestAnimationFrame(() => {
            if (currentY + 100 > flatlistHeight) {
                flatlist.current.scrollToOffset({
                    offset: scrollOffset + 20,
                    animated: false
                });
            } else if (currentY < 150) {
                flatlist.current.scrollToOffset({
                    offset: scrollOffset - 20,
                    animated: false
                })
            }

            // check y value see if we need to reorder
            const newIdx = yToIndex(currentY);
            if (currentIdx !== newIdx) {
                setData(immutableMove(data, currentIdx, newIdx));
                SetdraggingIdx(newIdx);
                currentIdx = newIdx;
            }

            animateList();
        });
    };

    const favouriteList = authContext.user ? props.stores.filter((value, index) => {
        return authContext.user.favouriteRestaurent?.includes(value._id)
    }) : []

    return (
        <Screen style={styles.container}>
            <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Header isHome={true}>Quán thân thương</Header>
            {dragging && <Animated.View
                style={{
                    right: 0,
                    top: point.getLayout().top,
                    zIndex: 2,
                    position: 'absolute',
                    width: '100%'
                }}
            >
                {renderItem({ item: data[draggingIdx], index: -1 }, true)}
            </Animated.View>}
            <FlatList
                ref={flatlist}
                scrollEnabled={!dragging}
                data={favouriteList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                onScroll={e => {
                    scrollOffset = e.nativeEvent.contentOffset.y;
                }}
                scrollEventThrottle={16}
                onLayout={e => {
                    flatlistTopOffset = e.nativeEvent.layout.y;
                    flatlistHeight = e.nativeEvent.layout.height;
                }}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {},
    item: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center'
    },
    box: {
        height: 150,
        width: 150,
        backgroundColor: "blue",
        borderRadius: 5
    }
});

const mapStateToProps = (state) => {
    return {
        stores: state.stores
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Wishlist))


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function immutableMove(arr, from, to) {
    return arr.reduce((prev, current, idx, self) => {
        if (from === to) {
            prev.push(current);
        }
        if (idx === from) {
            return prev;
        }
        if (from < to) {
            prev.push(current);
        }
        if (idx === to) {
            prev.push(self[from]);
        }
        if (from > to) {
            prev.push(current);
        }
        return prev;
    }, []);
}


const dataTest = Array.from(Array(15), (_, i) => {
    color[i] = getRandomColor();
    return i;
})
