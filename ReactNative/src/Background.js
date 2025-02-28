import React from 'react';
import {View, ImageBackground} from 'react-native';

const Background = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground 
        source={require("./assets/leaves.jpg")} 
        style={{ flex: 1, width: '100%' }}
        resizeMode="cover"
      >
        <View style={{ flex: 1 }}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
}

export default Background;
