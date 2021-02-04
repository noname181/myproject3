import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Button, Image, TouchableOpacity, Text, Alert, Platform, Dimensions } from 'react-native';
import AuthContext from '../hooks/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import Screen from '../components/Screen';
import { MyStatusBar, TextLink } from '../components';
import ImagePicker from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import FormData from 'form-data';
import Loading from '../components/Loading';
import jwtDecode from 'jwt-decode';


const width = Dimensions.get('window').width;

function Account({ navigation }) {
    const authContext = useContext(AuthContext);
    const [fileUri, SetFileuri] = useState();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState();

    useEffect(() => {
        AsyncStorage.getItem('token').then(res => setToken(res))
        return () => {
        };
    }, []);
    const chooseImage = () => {
        let options = {
            title: 'Select Avatar',
            cameraType: 'front',
            mediaType: 'photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                SetFileuri(response.uri) //update state to update Image
                console.log(response)
                Alert.alert(
                    'Confirm',
                    'Are you sure to update your avatar?',
                    [

                        {
                            text: 'No',
                            onPress: () => SetFileuri(null),
                            style: 'cancel'
                        },
                        {
                            text: 'OK', onPress: () => {
                                navigation.setOptions({
                                    tabBarVisible: false
                                });
                                const formData = new FormData();
                                formData.append('submit', 'ok');
                                formData.append('file', { type: response.type, uri: Platform.OS == 'ios' ? response.uri : 'file://' + response.path, name: "noname.jpg" });
                                formData.append('oldImage', authContext.user.image);
                                console.log(formData);
                                setLoading(true);
                                setTimeout(() => {
                                    axios.post('https://svhutech.nonamee.com/upload.php', formData, {
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                        }
                                    })
                                        .then(res => {
                                            console.log(res);
                                            axios.put('https://restfull-api-nodejs-mongodb.herokuapp.com/users/' + authContext.user['_id'], {
                                                image: res.data.image
                                            }, {
                                                headers: {
                                                    'x-auth-token': token
                                                }
                                            }).then(res => {
                                                setLoading(false);
                                                navigation.setOptions({
                                                    tabBarVisible: true
                                                });
                                                AsyncStorage.setItem('token', res.headers['x-auth-token']);
                                                let user = jwtDecode(res.headers['x-auth-token']);
                                                console.log(user.image);
                                                authContext.setUser(user);
                                            })
                                        })
                                        .catch((err) => {
                                            console.log(err)
                                        })

                                }, 1000);
                            }
                        }
                    ],
                    { cancelable: false }
                );
            }
        });
    }

    return (
        <Screen style={styles.container}>
            { loading ? <Loading></Loading> : null}
            <MyStatusBar backgroundColor="#f75f2d" barStyle="light-content" />
            <TouchableOpacity style={styles.info}>
                <View style={{ height: 80, width: 80, position: 'relative', marginHorizontal: 20 }}>
                    <Image
                        resizeMode="cover"
                        style={{ height: 80, width: 80, borderRadius: 50 }}
                        source={fileUri ? { uri: fileUri } : // if clicked a new img
                            authContext.user['image'] ? { uri: 'https://svhutech.nonamee.com/upload/' + authContext.user['image'] } : { uri: 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png' }} //else show random
                    />
                    <TouchableOpacity style={styles.addPictureIcon} onPress={
                        chooseImage
                    }>
                        <MaterialCommunityIcons name="camera" size={20} />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.textInfo}>{authContext.user.name}</Text>
                    <Text style={styles.textInfo}>{authContext.user.email}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cartBar} onPress={() => {
                console.log("ok");
                authContext.setUser(null);
                AsyncStorage.removeItem('token');
            }}>

                <Text style={styles.cartText}>LogOut</Text>

            </TouchableOpacity>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative'
    },
    addPictureIcon: {
        height: 30,
        width: 30,
        backgroundColor: "#fff",
        borderRadius: 50,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f75f2d',
        paddingVertical: 20
    },
    textInfo: {
        color: "#fff",
        marginBottom: 7,
    },
    cartText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    cartBar: {
        width: width - 30,
        borderRadius: 5,
        height: 45,
        backgroundColor: '#f75f2d',
        marginHorizontal: 15,
        position: 'absolute',
        bottom: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15
    }
});

export default Account;