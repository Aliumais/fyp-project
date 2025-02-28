"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"

const Profile = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const navigation = useNavigation()

  const validateInput = () => {
    if (!email || !firstName || !lastName || !contactNumber) {
      Alert.alert("Validation Error", "All fields are required.")
      return false
    }

    const contactNumberRegex = /^[0-9]{10,15}$/
    if (!contactNumber.match(contactNumberRegex)) {
      Alert.alert("Validation Error", "Contact number must be between 10 and 15 digits.")
      return false
    }

    return true
  }

  const handleUpdateProfile = async () => {
    if (!validateInput()) return

    try {
      const response = await fetch("http://10.0.2.2:4000/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          contactNumber,
        }),
      })

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()

        if (response.ok) {
          Alert.alert("Success", "Profile updated successfully.")
          navigation.goBack()
        } else {
          Alert.alert("Error", data.error || "Failed to update profile.")
        }
      } else {
        const text = await response.text()
        console.error("Unexpected response:", text)
        Alert.alert("Error", "Server returned an unexpected response.")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      Alert.alert("Error", "An error occurred while updating your profile.")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f8f8f8",
  },
  buttonContainer: {
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default Profile

