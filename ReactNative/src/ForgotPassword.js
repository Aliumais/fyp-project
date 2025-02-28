import React, {useState} from 'react';
import {View, Text, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import Background from './Background';
import Btn from './Btn';
import {darkGreen} from './Constants';
import Field from './Field';
import {validateEmail, validatePassword} from './utils/validation';
import axios from 'axios';

const backend_url = "http://10.0.2.2:4000/user"; // Base URL
const forgot_password_url = `${backend_url}/forgot-password`;
const reset_password_url = `${backend_url}/reset-password`;

const ForgotPassword = (props) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleForgotPassword = async () => {
    // Reset errors
    setEmailError('');

    // Validate email
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    try {
      console.log('Sending forgot password request for email:', email);
      const response = await axios.post(forgot_password_url, {
        email: email,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Forgot password response:', response.data);

      if (response.status === 200) {
        setResetToken(response.data.resetToken);
        setShowResetForm(true);
        Alert.alert('Success', 'Reset token generated successfully. Please enter your new password.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'An error occurred while processing your request'
      );
    }
  };

  const handleResetPassword = async () => {
    // Validate password
    setPasswordError('');
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      console.log('Sending reset password request');
      const response = await axios.post(reset_password_url, {
        token: resetToken,
        newPassword: newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Reset password response:', response.data);

      if (response.status === 200) {
        Alert.alert('Success', 'Password reset successful', [
          {
            text: 'OK',
            onPress: () => props.navigation.navigate('Login'),
          },
        ]);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'An error occurred while resetting your password'
      );
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
            marginVertical: 20,
          }}>
          Forgot Password
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
          <Text style={{fontSize: 30, color: darkGreen, fontWeight: 'bold'}}>
            {showResetForm ? 'Enter New Password' : 'Forgot Password'}
          </Text>
          <Text
            style={{
              color: 'grey',
              fontSize: 19,
              fontWeight: 'bold',
              marginBottom: 20,
            }}>
            {showResetForm
              ? 'Please enter your new password'
              : 'Enter your email to reset password'}
          </Text>

          {!showResetForm ? (
            <>
              <Field
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setEmailError('');
                }}
                error={emailError}
              />
              <Btn
                textColor="white"
                bgColor={darkGreen}
                btnLabel="Send Reset Link"
                Press={handleForgotPassword}
              />
            </>
          ) : (
            <>
              <Field
                placeholder="New Password"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                error={passwordError}
              />
              <Btn
                textColor="white"
                bgColor={darkGreen}
                btnLabel="Reset Password"
                Press={handleResetPassword}
              />
            </>
          )}

          <View style={styles.loginContainer}>
            <Text style={styles.rememberText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  rememberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: darkGreen,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ForgotPassword;
