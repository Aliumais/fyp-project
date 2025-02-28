import React from 'react';
import {View, Text, ScrollView, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {darkGreen} from '../Constants';

const TermsAndConditions = ({visible, onClose}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Terms and Conditions</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.text}>
              By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.
            </Text>

            <Text style={styles.sectionTitle}>2. User Account</Text>
            <Text style={styles.text}>
              2.1. You must provide accurate and complete information when creating an account.{'\n'}
              2.2. You are responsible for maintaining the confidentiality of your account credentials.{'\n'}
              2.3. You must immediately notify us of any unauthorized use of your account.
            </Text>

            <Text style={styles.sectionTitle}>3. User Conduct</Text>
            <Text style={styles.text}>
              3.1. You agree not to use the application for any unlawful purpose.{'\n'}
              3.2. You agree not to attempt to gain unauthorized access to any portion of the application.{'\n'}
              3.3. You agree not to interfere with or disrupt the application or servers.
            </Text>

            <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
            <Text style={styles.text}>
              4.1. All content included in this application is the property of our company.{'\n'}
              4.2. You may not reproduce, distribute, or create derivative works from this content.
            </Text>

            <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
            <Text style={styles.text}>
              5.1. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages.{'\n'}
              5.2. We are not responsible for any loss of data or unauthorized access to your account.
            </Text>

            <Text style={styles.sectionTitle}>6. Changes to Terms</Text>
            <Text style={styles.text}>
              We reserve the right to modify these terms at any time. We will notify users of any changes by updating the date at the top of this agreement.
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: darkGreen,
    marginBottom: 15,
  },
  scrollView: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkGreen,
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: darkGreen,
    borderRadius: 20,
    padding: 10,
    width: 200,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TermsAndConditions;
