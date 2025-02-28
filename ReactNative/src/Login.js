import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import Background from './Background';
import Btn from './Btn';
import {darkGreen} from './Constants';
import Field from './Field';
import Checkbox from './components/Checkbox';
//import SocialAuth from './components/SocialAuth';
import {validateEmail, validatePassword} from './utils/validation';
import {
  saveUserCredentials,
  getUserCredentials,
  clearUserCredentials,
  setRememberMe,
  getRememberMe,
} from './utils/storage';
import axios from 'axios';
const backend_url="http://10.0.2.2:4000/user/login/"

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMeState] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Load remembered credentials when component mounts
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    const remembered = await getRememberMe();
    if (remembered) {
      const credentials = await getUserCredentials();
      if (credentials) {
        setEmail(credentials.email);
        setPassword(credentials.password);
        setRememberMeState(true);
      }
    }
  };

  const handleRememberMe = async (value) => {
    setRememberMeState(value);
    await setRememberMe(value);
    if (!value) {
      await clearUserCredentials();
    }
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate inputs
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError || passwordValidationError) {
        setEmailError(emailValidationError);
        setPasswordError(passwordValidationError);
        return;
    }

    // Save credentials if remember me is checked
    if (rememberMe) {
        await saveUserCredentials(email, password);
    } else {
        await clearUserCredentials();
    }

    const userData = {
        email,
        password
    };

    try {
        // Post request with JSON
        const response = await axios.post(backend_url, userData, {
            headers: {
                'Content-Type': 'application/json', // Explicitly set JSON content type
            },
        });

        if (response.status === 200) {
            // Success: login successful
            Alert.alert('Success', 'Login successful!');
            props.navigation.navigate("Dashboard"); // Navigate to PostLoginPage
        } else {
            // Handle cases where response is not 200 (e.g., 400, 404, etc.)
            Alert.alert('Error', `Login failed: ${response.data.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Login error:', error); // Log the entire error for debugging purposes

        if (error.response) {
            // The server responded with an error status code
            console.error('Response error:', error.response);
            Alert.alert('Error', `Login failed: ${error.response.data.error || 'An error occurred'}`);
        } else if (error.request) {
            // The request was made, but no response was received (network error, server unreachable)
            console.error('Request error:', error.request);
            Alert.alert('Error', 'Network error. Please check your internet connection or try again later.');
        } else {
            // Something happened in setting up the request (e.g., misconfiguration)
            console.error('Axios setup error:', error.message);
            Alert.alert('Error', 'An error occurred while setting up the request.');
        }
    }
};

  
 // const handleGoogleLogin = () => {
   // Alert.alert('Google Login', 'Implement Google OAuth login here');
    // Implement Google OAuth login
 // };

 // const handleFacebookLogin = () => {
   // Alert.alert('Facebook Login', 'Implement Facebook OAuth login here');
    // Implement Facebook OAuth login
  //};

  return (
    <Background>
      <View style={{alignItems: 'center', width: 460}}>
        <Text
          style={{
            color: 'white',
            fontSize: 64,
            fontWeight: 'bold',
            marginVertical: 20,
          }}>
          Login
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            height: 700,
            width: 460,
            borderTopLeftRadius: 130,
            paddingTop: 100,
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 40, color: darkGreen, fontWeight: 'bold'}}>
            Welcome Back
          </Text>
          <Text
            style={{
              color: 'grey',
              fontSize: 19,
              fontWeight: 'bold',
              marginBottom: 20,
            }}>
            Login to your account
          </Text>
          <Field
            placeholder="Email / Username"
            keyboardType={'email-address'}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            error={emailError}
          />
          <Field 
            placeholder="Password" 
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            error={passwordError}
          />
          
          <View style={styles.rememberMeContainer}>
            <View style={styles.checkboxRow}>
              <Checkbox
                checked={rememberMe}
                onPress={() => handleRememberMe(!rememberMe)}
              />
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </View>
            <TouchableOpacity onPress={() => props.navigation.navigate("ForgotPassword")}>
              <Text style={styles.forgotPasswordText}>
                Forgot Password ?
              </Text>
            </TouchableOpacity>
          </View>

          <Btn 
            textColor='white' 
            bgColor={darkGreen} 
            btnLabel="Login" 
            Press={handleLogin}
          />

          

          <View style={styles.signupContainer}>
            <Text style={styles.noAccountText}>Don't have an account ? </Text>
            <TouchableOpacity onPress={() => props.navigation.navigate("Signup")}>
              <Text style={styles.signupText}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  rememberMeContainer: {
    width: '78%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    color: 'grey',
    fontSize: 14,
    marginLeft: 8,
  },
  forgotPasswordText: {
    color: darkGreen,
    fontWeight: 'bold',
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  noAccountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  signupText: {
    color: darkGreen,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Login;
