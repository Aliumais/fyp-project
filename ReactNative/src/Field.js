import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import {darkGreen} from './Constants';

const Field = ({error, ...props}) => {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={[
          styles.input,
          error ? styles.inputError : null,
        ]}
        placeholderTextColor={darkGreen}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '68%',
    marginVertical: 5,
  },
  input: {
    borderRadius: 100,
    color: darkGreen,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: 'rgb(220,220, 220)',
    marginVertical: 5,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#c62828',
  },
  errorText: {
    color: '#c62828',
    fontSize: 12,
    marginLeft: 10,
  },
});

export default Field;
