import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import CultivationGuidance from './CultivationGuidance';
import MarketDataInsights from './MarketDataInsights';
import ForgotPassword from './ForgotPassword';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Profile from './components/Profile';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: true,
          header: (props) => 
            props.route.name !== 'Login' && 
            props.route.name !== 'Home' && 
            props.route.name !== 'ForgotPassword' && 
            props.route.name !== 'Signup' ? <Navbar /> : null
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="CultivationGuidance" component={CultivationGuidance} />
        <Stack.Screen name="MarketDataInsights" component={MarketDataInsights} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ManageProfile" component={Dashboard} />
        <Stack.Screen name="DiseasesDetection" component={Dashboard} />
        <Stack.Screen name="FertilizerRecommendation" component={Dashboard} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;