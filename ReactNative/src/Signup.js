import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import Background from './Background';
import Btn from './Btn';
import {darkGreen} from './Constants';
import Field from './Field';
import Checkbox from './components/Checkbox';
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

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }) => {
  const [strength, setStrength] = useState({
    score: 0,
    label: 'Too Weak',
    color: '#ff4d4d'
  });

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, label: 'Too Weak', color: '#ff4d4d' });
      return;
    }

    // Calculate password strength
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    // Set strength label and color based on score
    let label, color;
    switch (true) {
      case (score <= 1):
        label = 'Too Weak';
        color = '#ff4d4d';
        break;
      case (score <= 2):
        label = 'Weak';
        color = '#ffaa00';
        break;
      case (score <= 3):
        label = 'Medium';
        color = '#ffdd00';
        break;
      case (score <= 4):
        label = 'Strong';
        color = '#00cc44';
        break;
      default:
        label = 'Very Strong';
        color = '#00aa44';
    }

    setStrength({ score, label, color });
  }, [password]);

  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthBars}>
        {[1, 2, 3, 4, 5].map((bar) => (
          <View 
            key={bar} 
            style={[
              styles.strengthBar, 
              { 
                backgroundColor: bar <= strength.score ? strength.color : '#e0e0e0' 
              }
            ]} 
          />
        ))}
      </View>
      <Text style={[styles.strengthLabel, { color: strength.color }]}>
        {strength.label}
      </Text>
    </View>
  );
};

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

  // Real-time validation functions
  const validateFirstNameRealTime = (text) => {
    setFirstName(text);
    if (text.trim() === '') {
      setFirstNameError('');
    } else {
      setFirstNameError(validateName(text, 'First Name'));
    }
  };

  const validateLastNameRealTime = (text) => {
    setLastName(text);
    if (text.trim() === '') {
      setLastNameError('');
    } else {
      setLastNameError(validateName(text, 'Last Name'));
    }
  };

  const validateEmailRealTime = (text) => {
    setEmail(text);
    if (text.trim() === '') {
      setEmailError('');
    } else {
      setEmailError(validateEmail(text));
    }
  };

  const validatePhoneRealTime = (text) => {
    setPhone(text);
    if (text.trim() === '') {
      setPhoneError('');
    } else {
      setPhoneError(validatePhone(text));
    }
  };

  const validatePasswordRealTime = (text) => {
    setPassword(text);
    if (text.trim() === '') {
      setPasswordError('');
    } else {
      setPasswordError(validatePassword(text));
    }
    
    // Also update confirm password validation when password changes
    if (confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(text, confirmPassword));
    }
  };

  const validateConfirmPasswordRealTime = (text) => {
    setConfirmPassword(text);
    if (text.trim() === '') {
      setConfirmPasswordError('');
    } else {
      setConfirmPasswordError(validateConfirmPassword(password, text));
    }
  };

  // Password requirements list with dynamic validation
  const PasswordRequirements = ({ password }) => {
    const requirements = [
      { label: 'At least 8 characters', valid: password.length >= 8 },
      { label: 'Contains uppercase letter', valid: /[A-Z]/.test(password) },
      { label: 'Contains lowercase letter', valid: /[a-z]/.test(password) },
      { label: 'Contains a number', valid: /[0-9]/.test(password) },
      { label: 'Contains special character', valid: /[^A-Za-z0-9]/.test(password) },
    ];

    return (
      <View style={styles.requirementsContainer}>
        {requirements.map((req, index) => (
          <View key={index} style={styles.requirementRow}>
            <Text style={[
              styles.requirementDot, 
              { color: req.valid ? '#00aa44' : '#888888' }
            ]}>
              {req.valid ? '✓' : '○'}
            </Text>
            <Text style={[
              styles.requirementText,
              { color: req.valid ? '#00aa44' : '#888888' }
            ]}>
              {req.label}
            </Text>
          </View>
        ))}
      </View>
    );
  };

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
            height: 'auto',
            width: 460,
            borderTopLeftRadius: 130,
            paddingTop: 50,
            paddingBottom: 50,
            alignItems: 'center',
          }}>
          <Field 
            placeholder="First Name" 
            onChangeText={validateFirstNameRealTime}
            error={firstNameError}
          />
          <Field 
            placeholder="Last Name" 
            onChangeText={validateLastNameRealTime}
            error={lastNameError}
          />
          <Field
            placeholder="Email / Username"
            keyboardType={'email-address'}
            onChangeText={validateEmailRealTime}
            error={emailError}
          />
          <Field 
            placeholder="Contact Number" 
            keyboardType={'numeric'}
            onChangeText={validatePhoneRealTime}
            error={phoneError}
          />
          <Field 
            placeholder="Password" 
            secureTextEntry={true}
            onChangeText={validatePasswordRealTime}
            error={passwordError}
          />
          
          {/* Password strength indicator */}
          {password.length > 0 && (
            <>
              <PasswordStrengthIndicator password={password} />
              <PasswordRequirements password={password} />
            </>
          )}
          
          <Field 
            placeholder="Confirm Password" 
            secureTextEntry={true}
            onChangeText={validateConfirmPasswordRealTime}
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
  strengthContainer: {
    width: '78%',
    marginTop: 5,
    marginBottom: 10,
  },
  strengthBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  strengthBar: {
    height: 4,
    width: '18%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  requirementsContainer: {
    width: '78%',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  requirementDot: {
    fontSize: 14,
    marginRight: 8,
  },
  requirementText: {
    fontSize: 12,
  }
});

export default Signup;