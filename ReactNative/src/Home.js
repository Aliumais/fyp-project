import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import Background from './Background';
import Btn from './Btn';
import { darkGreen, green } from './Constants';
//import MarketDataInsights from './MarketDataInsights';

const HomeUpdated = (props) => {
  return (
    <Background>
      <View style={{ marginHorizontal: 64, marginVertical: 190 }}>
<Image source={require('./assets/logo.png')} style={{ width: 150, height: 180, marginBottom: 20 ,marginHorizontal:70}} />
        <Text style={{ color: 'white', fontSize: 55 }}>Potato Max</Text>

        <Btn bgColor={green} textColor='white' btnLabel="Login" Press={() => props.navigation.navigate("Login")} />
        <Btn bgColor='white' textColor={darkGreen} btnLabel="Signup" Press={() => props.navigation.navigate("Signup")} />

        {/* New Components */}
        {/* New Components */}
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({})

export default HomeUpdated;