import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Platform, TextInput, Button, Modal, Text, TouchableHighlight, Alert } from 'react-native';
import { Screen, Loading, Header, MyButton, MyStatusBar, ErrorMessage, TextLink, InputIcon } from '../components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import AuthContext from '../hooks/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input'

const width = Dimensions.get('window').width;
const validateSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().min(5).required().label("Password")
})

const Login = () => {
    const navigation = useNavigation();
    const authContext = useContext(AuthContext);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [googleStatus, setgoogleStatus] = useState({
        userInfo: '',
        loggedIn: false
    });
    // If null, no SMS has been sent
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [phone, setPhone] = useState('');
    const [typeCode, setTypeCode] = useState(false);

    function login(values) {
        navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: false
        });
        setLoading(true);
        axios.post("https://restfull-api-nodejs-mongodb.herokuapp.com/auth/", {
            email: values.email,
            password: values.password
        }, {
            timeout: 120000
        })
            .then(res => {
                const user = jwtDecode(res.data);
                setLoading(false);
                navigation.dangerouslyGetParent().setOptions({
                    tabBarVisible: true
                });
                navigation.navigate('Map')
                AsyncStorage.setItem('token', res.data)
                authContext.setUser(user);
            })
            .catch(err => {
                setLoading(false);
                navigation.dangerouslyGetParent().setOptions({
                    tabBarVisible: true
                });
                setError('Invalid email or password')
            })


    }

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: Platform.OS === 'ios' ? '776403509046-ru3ejuqhv00oojv9bufgh51tm7p3plfl.apps.googleusercontent.com' : '776403509046-ltgrrjk6pnaika1ib6vplmkf19va3j44.apps.googleusercontent.com',
            offlineAccess: true,
            hostedDomain: '',
            forceConsentPrompt: true,
        });
        return () => {
            navigation.dangerouslyGetParent().setOptions({
                tabBarVisible: true
            });
        };
    }, []);

    async function signInWithPhoneNumber(phoneNumber) {
        let type = phoneNumber.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        let phoneFormat = ('+84 ') + (type[1] ? + type[1] : '') + (type[2] ? + type[2] : '') + (type[3] ? type[3] : '');
        console.log(phoneFormat);
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneFormat);
            setConfirm(confirmation);
            setTypeCode(true);
        }
        catch (err) {
            alert(err);
        }
    }

    const modalVerifyMobile = () => {
        setModalVisible(true);
    }

    async function confirmCode() {
        try {
            let res = await confirm.confirm(code);
            setModalVisible(false);
            setTypeCode(false);
        } catch (error) {
            console.log('Invalid code.');
        }
    }


    const signInGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { email, name, photo } = await (await GoogleSignin.signIn()).user;
            console.log(email, name, photo);
            setgoogleStatus({ userInfo: { email, name, photo }, loggedIn: true });
            // create a new firebase credential with the token
            navigation.dangerouslyGetParent().setOptions({
                tabBarVisible: false
            });
            setLoading(true);
            axios.post("https://restfull-api-nodejs-mongodb.herokuapp.com/users/google", {
                email: email
            }).then(res => {
                if (res.data.status === "true") {
                    const user = jwtDecode(res.data.token);
                    setLoading(false);
                    navigation.dangerouslyGetParent().setOptions({
                        tabBarVisible: true
                    });
                    navigation.navigate('Map');
                    AsyncStorage.setItem('token', res.data.token)
                    authContext.setUser(user);
                } else {
                    setLoading(false);
                    navigation.navigate('Signup', {
                        email: email,
                        name: name
                    })
                }
            })
                .catch(err => {
                    setLoading(false);
                    navigation.dangerouslyGetParent().setOptions({
                        tabBarVisible: true
                    });
                })

        } catch (error) {
            console.log(error);

        }
    };


    return (
        <Screen>
            { loading ? <Loading></Loading> : null}
            <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Header isHome={true}> LOGIN</Header>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}

            >
                <View style={styles.centeredView}>
                    <TouchableHighlight style={{ flex: 1, backgroundColor: '#000', position: 'absolute', width: '100%', height: '100%', opacity: 0.3 }} onPress={() => setModalVisible(!modalVisible)} >
                        <View></View>
                    </TouchableHighlight>

                    <View style={styles.modalView}>
                        {typeCode ? <View style={styles.verifyCode}>

                            <OTPInputView
                                pinCount={6}
                                style={{ width: '100%', height: 60 }}
                                codeInputFieldStyle={styles.code}
                                onCodeFilled={(code => {
                                    setCode(code);
                                })}
                            />
                        </View> : null}
                        {
                            typeCode ? null : <InputIcon
                                name="phone"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Phone Number"
                                placeholderTextColor="gray"
                                value={'+84 ' + phone}
                                keyboardType="numeric"
                                maxLength={13}
                                onChangeText={(text) => {
                                    let type = text.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})/);
                                    let phoneFormat = (type[2] ? + type[2] : '').toString() + (type[3] ? + type[3] : '').toString() + (type[4] ? type[4] : '').toString();
                                    console.log(type);
                                    console.log(phoneFormat);
                                    setPhone(phoneFormat);

                                }}
                                style={[styles.input, { width: '100%' }]}
                            />
                        }
                        {
                            typeCode ? null : <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#f75f2d", width: 120, marginTop: 25 }}
                                onPress={() => {
                                    signInWithPhoneNumber(phone);
                                }}
                            >
                                <Text style={styles.textStyle}>Send Code</Text>
                            </TouchableHighlight>
                        }
                        {
                            typeCode ? <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#f75f2d", width: 120, marginTop: 25 }}
                                onPress={() => {
                                    confirmCode();
                                }}
                            >
                                <Text style={styles.textStyle}>Verify</Text>
                            </TouchableHighlight> : null
                        }


                    </View>
                </View>
            </Modal>
            <ScrollView>
                <View style={styles.container}>
                    <Formik
                        initialValues={{ email: "", password: "" }}
                        onSubmit={values => login(values)}
                        validationSchema={validateSchema}
                    >
                        {({ handleChange, handleSubmit, errors, values }) => (
                            <>
                                <InputIcon
                                    name="email"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholder="Email"
                                    placeholderTextColor="gray"
                                    value={values.email}
                                    // onChangeText={(text) => {
                                    //     setLoginInfo({
                                    //         ...loginInfo,
                                    //         email: text
                                    //     })
                                    // }}
                                    onChangeText={handleChange('email')}
                                    keyboardType="email-address"
                                    style={styles.input}
                                />

                                <ErrorMessage error={errors.email}></ErrorMessage>

                                <InputIcon
                                    name="lock"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholder="Password"
                                    placeholderTextColor="gray"
                                    value={values.password}
                                    // onChangeText={(text) => {
                                    //     setLoginInfo({
                                    //         ...loginInfo,
                                    //         password: text
                                    //     })
                                    // }}
                                    onChangeText={handleChange('password')}
                                    secureTextEntry={true}
                                    style={styles.input}
                                />
                                <ErrorMessage error={errors.password}></ErrorMessage>

                                <MyButton
                                    title={'Login'}
                                    style={styles.submit}
                                    textStyle={styles.textStyle}
                                    // onPress={() => login()}
                                    onPress={handleSubmit}
                                >Submit</MyButton>
                                <ErrorMessage error={error} style={{ textAlign: 'center', marginTop: 10 }}></ErrorMessage>
                            </>
                        )}
                    </Formik>
                    <View style={styles.helper}>
                        <TextLink onPress={() => navigation.navigate('ForgotPass')}>Forgot password?</TextLink>
                        <TextLink onPress={() => navigation.navigate('Signup')}>Signup</TextLink>

                    </View>
                </View>
                <View style={styles.social}>
                    {/* <MyButton
                        title={'Login'}
                        style={styles.socialbtn}
                        textStyle={styles.textSocial}
                        onPress={() => modalVerifyMobile()}
                        // onPress={() => signInWithPhoneNumber('+84819521414')}
                        icon={<FontAwesome name="mobile-phone" color="#f75f2d" size={28} />}
                    >

                        Phone Number
                    </MyButton>
                    <MyButton
                        title={'Login'}
                        style={styles.socialbtn}
                        textStyle={styles.textSocial}
                        onPress={() => { }}
                        icon={<FontAwesome name="facebook" color="blue" size={28} />}
                    >

                        Facebook
                    </MyButton> */}
                    <MyButton
                        title={'Login'}
                        style={styles.socialbtn}
                        textStyle={styles.textSocial}
                        onPress={() => { signInGoogle() }}
                        icon={<FontAwesome name="google" color="green" size={28} />}
                    >

                        Google
                    </MyButton>
                </View>
            </ScrollView>
        </Screen>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 40,
    },
    input: {
        width: width - 40,
        height: 44,
        borderBottomWidth: 1,
        borderColor: 'black',
        marginBottom: 20,
        backgroundColor: '#fff',

    },
    inputext: {
        width: width - 40,
        height: 44,
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    submit: {
        backgroundColor: '#f75f2d',
        width: width - 40,
        marginTop: 40
    },
    textStyle: {
        color: '#fff',
        fontSize: 18
    },
    helper: {
        marginTop: 20,
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 20
    },
    social: {
        alignItems: 'center',
        marginTop: 40,
        paddingBottom: 40
    },
    socialbtn: {
        backgroundColor: '#fff',
        width: width - 40,
        marginTop: 15,
        borderWidth: 1,
        borderColor: "#000"
    },
    textSocial: {
        color: "#000",
        marginLeft: 15
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
    },
    modalView: {
        width: '90%',
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 5,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    verifyCode: {
        flexDirection: 'row',
    },
    code: {
        borderRadius: 12,
        borderColor: '#f75f2d',
        borderWidth: 3,
        width: 40,
        height: 60,
        textAlign: 'center',
        fontSize: 25,
        color: '#f75f2d',
        fontWeight: 'bold'
    }
});

export default Login;
