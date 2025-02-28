import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Navbar = () => {
    const navigation = useNavigation();

    const handleLogout = () => {
        navigation.navigate('Login');
    };

    const handleCamera = () => {
        // Camera functionality to be implemented
        console.log('Camera button pressed');
    };

    return (
        <View style={styles.navbar}>
            <View style={styles.leftSection}>
                <TouchableOpacity 
                    style={styles.cameraButton}
                    onPress={handleCamera}
                >
                    <Icon name="camera-alt" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>Logout</Text>
                <Icon name="logout" size={20} color="#fff" style={styles.logoutIcon} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#023020',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cameraButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 8,
        borderRadius: 8,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
    },
    logoutIcon: {
        marginLeft: 5,
    }
});

export default Navbar;
