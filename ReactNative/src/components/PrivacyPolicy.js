import React from 'react';
import {View, Text, ScrollView, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {darkGreen} from '../Constants';

const PrivacyPolicy = ({visible, onClose}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Privacy Policy</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.text}>
              1.1. Personal Information:{'\n'}
              • Name and contact details{'\n'}
              • Email address{'\n'}
              • Phone number{'\n'}
              • Account credentials
            </Text>

            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.text}>
              2.1. We use your information to:{'\n'}
              • Provide and maintain our services{'\n'}
              • Notify you about changes to our services{'\n'}
              • Provide customer support{'\n'}
              • Monitor usage of our services
            </Text>

            <Text style={styles.sectionTitle}>3. Data Security</Text>
            <Text style={styles.text}>
              3.1. We implement appropriate security measures to protect your personal information.{'\n'}
              3.2. We use encryption to protect sensitive data transmitted through our application.{'\n'}
              3.3. We regularly review our security practices to ensure data protection.
            </Text>

            <Text style={styles.sectionTitle}>4. Data Sharing</Text>
            <Text style={styles.text}>
              4.1. We do not sell your personal information to third parties.{'\n'}
              4.2. We may share your information with:{'\n'}
              • Service providers who assist in our operations{'\n'}
              • Law enforcement when required by law
            </Text>

            <Text style={styles.sectionTitle}>5. Your Rights</Text>
            <Text style={styles.text}>
              You have the right to:{'\n'}
              • Access your personal data{'\n'}
              • Correct inaccurate data{'\n'}
              • Request deletion of your data{'\n'}
              • Object to data processing
            </Text>

            <Text style={styles.sectionTitle}>6. Cookies and Tracking</Text>
            <Text style={styles.text}>
              6.1. We use cookies and similar tracking technologies to track activity on our application.{'\n'}
              6.2. You can control cookie settings through your browser preferences.
            </Text>

            <Text style={styles.sectionTitle}>7. Changes to Privacy Policy</Text>
            <Text style={styles.text}>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </Text>

            <Text style={styles.sectionTitle}>8. Contact Us</Text>
            <Text style={styles.text}>
              If you have any questions about this Privacy Policy, please contact us at:{'\n'}
              Email: privacy@example.com{'\n'}
              Phone: (555) 123-4567
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

export default PrivacyPolicy;
