import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {darkGreen} from '../Constants';

const Checkbox = ({checked, onPress, error}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.checkbox, 
          checked ? styles.checked : styles.unchecked,
          error ? styles.error : null
        ]} 
        onPress={onPress}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checked: {
    backgroundColor: darkGreen,
    borderWidth: 1,
    borderColor: darkGreen,
  },
  unchecked: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: darkGreen,
  },
  error: {
    borderColor: '#c62828',
    borderWidth: 2,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Checkbox;
