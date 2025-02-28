/*import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {darkGreen} from '../Constants';
import GoogleIcon from '../assets/google-icon';
import FacebookIcon from '../assets/facebook-icon';

const SocialAuth = ({onGooglePress, onFacebookPress}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.dividerText}>Or continue with</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.socialButton, styles.googleButton]}
          onPress={onGooglePress}
        >
          <GoogleIcon />
          <Text style={styles.buttonText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.socialButton, styles.facebookButton]}
          onPress={onFacebookPress}
        >
          <FacebookIcon />
          <Text style={[styles.buttonText, styles.facebookText]}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '78%',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerText: {
    color: 'grey',
    fontSize: 14,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    width: '48%',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  facebookText: {
    color: '#fff',
  },
});

export default SocialAuth;*/
