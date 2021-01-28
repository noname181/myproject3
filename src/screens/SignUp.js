import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Screen, Loading, Header, MyButton, MyStatusBar, ErrorMessage, InputIcon } from '../components';
import axios from 'axios';
import AuthContext from '../hooks/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import jwtDecode from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';


const width = Dimensions.get('window').width;
const validateSchema = Yup.object().shape({
    name: Yup.string().required().min(2).label("Name"),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(5).label('Password'),
    repassword: Yup.string().oneOf([Yup.ref('password'), null], 'Repassword not match!').required().label('Repassword')
})

function SignUp({ route }) {
    const [loading, setLoading] = useState(false);
    const authContext = useContext(AuthContext);
    const navigation = useNavigation();
    const [error, setError] = useState();

    useEffect(() => {
        return () => {

        };
    }, []);

    signup = (values) => {
        console.log(values)
        navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: false
        });
        setLoading(true);
        axios.post("https://restfull-api-nodejs-mongodb.herokuapp.com/users", {
            name: values.name,
            email: values.email,
            password: values.password
        }).then(res => {
            console.log(res.headers['x-auth-token']);
            navigation.navigate('Map');
            setLoading(false);
            navigation.dangerouslyGetParent().setOptions({
                tabBarVisible: true
            });
            AsyncStorage.setItem('token', res.headers['x-auth-token']);
            let user = jwtDecode(res.headers['x-auth-token']);
            authContext.setUser(user);
        }).catch(err => {
            setLoading(false);
            navigation.dangerouslyGetParent().setOptions({
                tabBarVisible: true
            });
            setError('Invalid email or password')
        })
    }

    return (
        <Screen>
            { loading ? <Loading></Loading> : null}
            <MyStatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Header> SIGN UP</Header>
            <ScrollView>
                <View style={styles.container}>
                    <Formik
                        initialValues={{ name: route.params ? route.params.name : '', email: route.params ? route.params.email : '', password: '', repassword: '' }}
                        onSubmit={values => signup(values)}
                        validationSchema={validateSchema}
                    >
                        {({ values, handleChange, handleSubmit, errors }) => (
                            <>
                                <InputIcon
                                    name="card-account-details"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholder="Name"
                                    value={values.name}
                                    placeholderTextColor="gray"
                                    onChangeText={handleChange('name')}
                                    label='Name'
                                    style={styles.input}
                                />
                                <ErrorMessage error={errors.name}></ErrorMessage>
                                <InputIcon
                                    name="email"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholder="Email"
                                    value={values.email}
                                    keyboardType="email-address"
                                    placeholderTextColor="gray"
                                    onChangeText={handleChange('email')}
                                    label='Email'
                                    style={styles.input}
                                />
                                <ErrorMessage error={errors.email}></ErrorMessage>
                                <InputIcon
                                    name="lock"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholder="Password"
                                    placeholderTextColor="gray"
                                    onChangeText={handleChange('password')}
                                    label='Password'
                                    secureTextEntry={true}
                                    style={styles.input}
                                />
                                <ErrorMessage error={errors.password}></ErrorMessage>
                                <InputIcon
                                    name="lock"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholder="Repassword"
                                    placeholderTextColor="gray"
                                    onChangeText={handleChange('repassword')}
                                    label='Repassword'
                                    secureTextEntry={true}
                                    style={styles.input}
                                />
                                <ErrorMessage error={errors.repassword}></ErrorMessage>

                                <MyButton
                                    title={'Login'}
                                    style={styles.submit}
                                    textStyle={styles.textStyle}
                                    onPress={handleSubmit}
                                >Submit</MyButton>
                                <ErrorMessage error={error} style={{ textAlign: 'center' }}></ErrorMessage>
                            </>
                        )}
                    </Formik>

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
        paddingVertical: 10,
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
    }
});

export default SignUp;