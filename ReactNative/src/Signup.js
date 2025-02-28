import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import Background from './Background';
import Btn from './Btn';
import {darkGreen} from './Constants';
import Field from './Field';
import Checkbox from './components/Checkbox';
//import SocialAuth from './components/SocialAuth';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import axios from 'axios';
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateConfirmPassword
} from './utils/validation';
const backend_url="http://10.0.2.2:4000/user/register/"
const Signup = props => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');

  const handleSignup = async () => {
    // Reset all errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setTermsError('');
  
    // Validate all inputs
    const firstNameValidationError = validateName(firstName, 'First Name');
    const lastNameValidationError = validateName(lastName, 'Last Name');
    const emailValidationError = validateEmail(email);
    const phoneValidationError = validatePhone(phone);
    const passwordValidationError = validatePassword(password);
    const confirmPasswordValidationError = validateConfirmPassword(password, confirmPassword);
  
    // Validate terms acceptance
    if (!termsAccepted) {
      setTermsError('You must accept the Terms & Conditions to continue');
    }
  
    // Set errors if any
    setFirstNameError(firstNameValidationError);
    setLastNameError(lastNameValidationError);
    setEmailError(emailValidationError);
    setPhoneError(phoneValidationError);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmPasswordValidationError);
  
    // Check if there are any validation errors
    if (firstNameValidationError || lastNameValidationError || emailValidationError ||
      phoneValidationError || passwordValidationError || confirmPasswordValidationError || !termsAccepted) {
      return;
    }
  
    try {
      // If no errors, proceed with signup
      const userData = {
        firstName,
        lastName,
        email,
        password,
        contactNumber: `${phone}`
      };
  
      // Post request with JSON
      const response = await axios.post(backend_url, userData, {
        headers: {
          'Content-Type': 'application/json', // Explicitly set JSON content type
        },
      });
  
      if (response.status === 201) {
        console.log("success");
        Alert.alert('Success', 'Account created successfully!');
        props.navigation.navigate('Login');
      } else {
        console.log("Failed", response.status);
        Alert.alert('Error', 'Signup failed!');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error
        console.error('Server error:', JSON.stringify(error.response.data, null, 2));
        Alert.alert('Error', 'Server error, please try again later.');
      } else if (error.request) {
        // No response received
        console.error('No response received:', error.request);
        Alert.alert('Error', 'No response from server, check your network connection.');
      } else {
        // Error setting up the request
        console.error('Error in request:', error.message);
        Alert.alert('Error', 'Error in making request.');
      }
    }
  };

  //const handleGoogleSignup = () => {
   // Alert.alert('Google Signup', 'Implement Google OAuth signup here');
    // Implement Google OAuth signup
 // };

  //const handleFacebookSignup = () => {
    //Alert.alert('Facebook Signup', 'Implement Facebook OAuth signup here');
    // Implement Facebook OAuth signup
  //};

  return (
    <Background>
      <View style={{alignItems: 'center', width: 460}}>
        <Text
          style={{
            color: 'white',
            fontSize: 64,
            fontWeight: 'bold',
            marginTop: 20,
          }}>
          Register
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 19,
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          Create a new account
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            height: 700,
            width: 460,
            borderTopLeftRadius: 130,
            paddingTop: 50,
            alignItems: 'center',
          }}>
          <Field 
            placeholder="First Name" 
            onChangeText={(text) => {
              setFirstName(text);
              setFirstNameError('');
            }}
            error={firstNameError}
          />
          <Field 
            placeholder="Last Name" 
            onChangeText={(text) => {
              setLastName(text);
              setLastNameError('');
            }}
            error={lastNameError}
          />
          <Field
            placeholder="Email / Username"
            keyboardType={'email-address'}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            error={emailError}
          />
          <Field 
            placeholder="Contact Number" 
            keyboardType={'numeric'}
            onChangeText={(text) => {
              setPhone(text);
              setPhoneError('');
            }}
            error={phoneError}
          />
          <Field 
            placeholder="Password" 
            secureTextEntry={true}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            error={passwordError}
          />
          <Field 
            placeholder="Confirm Password" 
            secureTextEntry={true}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordError('');
            }}
            error={confirmPasswordError}
          />
          
          <View style={styles.termsContainer}>
            <View style={styles.checkboxRow}>
              <Checkbox
                checked={termsAccepted}
                onPress={() => {
                  setTermsAccepted(!termsAccepted);
                  setTermsError('');
                }}
                error={!!termsError}
              />
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text 
                  style={styles.link} 
                  onPress={() => setShowTerms(true)}>
                  Terms & Conditions
                </Text>
                {' '}and{' '}
                <Text 
                  style={styles.link} 
                  onPress={() => setShowPrivacy(true)}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
            {termsError ? (
              <Text style={styles.errorText}>{termsError}</Text>
            ) : null}
          </View>

          <Btn
            textColor="white"
            bgColor={darkGreen}
            btnLabel="Signup"
            Press={handleSignup}
          />

          

          <View style={styles.loginContainer}>
            <Text style={styles.hasAccountText}>
              Already have an account ?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Login')}>
              <Text style={styles.loginText}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TermsAndConditions 
        visible={showTerms} 
        onClose={() => setShowTerms(false)} 
      />
      
      <PrivacyPolicy 
        visible={showPrivacy} 
        onClose={() => setShowPrivacy(false)} 
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  termsContainer: {
    width: '78%',
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  termsText: {
    flex: 1,
    color: 'grey',
    fontSize: 14,
  },
  link: {
    color: darkGreen,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#c62828',
    fontSize: 12,
    marginLeft: 28,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  hasAccountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: darkGreen,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Signup;
