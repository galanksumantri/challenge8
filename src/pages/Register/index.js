import React from 'react';
import { TextInput, View, Text, Dimensions, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../themes';
import Button from '../../component/Button'
import auth from '@react-native-firebase/auth'
import { reference } from '../../database/firebase'
import * as navigation from '../../router/RootNavigation';

const validationSchema = Yup.object({
    name: Yup.string()
        .trim()
        .min(3, 'Invalid username!')
        .required('Username is required!'),
    bio: Yup.string()
        .trim()
        .min(3, 'Invalid bio!')
        .required('Bio is required!'),
    email: Yup.string()
        .email('Invalid email!')
        .required('Email is required!'),
    password: Yup.string()
        .trim()
        .min(8, 'Password is too short!')
        .required('Password is required!'),
    confirmPassword: Yup.string()
        .equals([Yup.ref('password'), null], 
        'Password does not match!')
})

const handleSubmit = ({ email, password, fullName, bio }) => {
  auth().createUserWithEmailAndPassword(email, password).then((response) => {
    const data = {
      fullName, email, bio, uid: response.user.uid
    }
    reference().ref(`users/${response.user.uid}/`).set(data);
    navigation.navigate('Login')
  })
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }
    console.error(error);
  });
}

export default function Register() {
  
  const userInfo = {
    name: '',
    bio: '',
    email: '',
    password: '',
    // confirmPassword: '',
  } 
  return (
    <SafeAreaView
      style={styles.content}>
      <Text style={styles.tittleText}>PokemonGo Lite</Text>
      <View style={styles.container}>
        <Formik
          initialValues={userInfo}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}         
        >
          {({ values, handleChange, handleBlur, handleSubmit, }) => {   
            const { name, bio, email, password, confirmPassword } = values;
            return(
                <View>
                <TextInput
                    style={styles.inputForm}
                    onChangeText={handleChange('name')}
                    value={name}
                    placeholder="Enter username"
                />
                <TextInput
                    style={styles.inputForm}
                    onChangeText={handleChange('bio')}
                    value={bio}
                    placeholder="Enter bio"
                />
                <TextInput
                    style={styles.inputForm}
                    onChangeText={handleChange('email')}
                    value={email}
                    placeholder="Enter email id"
                />
                <TextInput
                    style={styles.inputForm}
                    onChangeText={handleChange('password')}
                    value={password}
                    placeholder="Enter password"
                    secureTextEntry
                />
                <TextInput
                    style={styles.inputForm}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={confirmPassword}
                    placeholder="Enter password again"
                    secureTextEntry
                />              
                <Button
                    title="REGISTER"
                    // disabled={!isValid}
                    bgColor="green"
                    width= "0.7"
                    height= "0.05"
                    style={{marginTop:10}}
                    onPress={handleSubmit}
                    styleText="white"
                />
                </View>
          )}}
        </Formik>
      </View>
      <View style={styles.login}>
      <Text>Already have an account?</Text>
      <Button 
        title="Login here!"
        width="0.20"
        height="0.025"
        onPress={() => navigation.navigate("Login")}
      />
      </View>
    </SafeAreaView>
  );
}

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  login: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center"
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  content: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: COLORS.white
  },
  button: {
    backgroundColor: 'blue',
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  tittleText: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: 20,
  },
  inputForm: {
    borderWidth: 1,
    marginTop: 10,
    borderColor: "green",
    borderRadius: 10,
    height: windowHeight * 0.05 ,
  },
});