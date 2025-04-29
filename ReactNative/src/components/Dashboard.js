"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Modal, TextInput } from "react-native"

const { width } = Dimensions.get("window")

const Dashboard = ({ navigation }) => {
  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("sun")) return "☀️"
    if (conditionLower.includes("cloud")) return "☁️"
    if (conditionLower.includes("rain")) return "🌧️"
    if (conditionLower.includes("snow")) return "❄️"
    if (conditionLower.includes("thunder")) return "⛈️"
    return "🌤️" // default to partly cloudy
  }

  const [isHelpDrawerVisible, setIsHelpDrawerVisible] = useState(false)
  const [location, setLocation] = useState(""); // State for user input location
  const [currentWeather, setCurrentWeather] = useState({ temp: "", condition: "", icon: "" });

  useEffect(() => {
    const fetchWeatherData = async (lat, lon) => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=dce088c56173d4ff46072161100191e3&units=metric`);
        const data = await response.json();
        if (data.main) {
          setCurrentWeather({
            temp: `${Math.round(data.main.temp)}°C`, // Round to nearest integer
            condition: data.weather[0].description,
            icon: getWeatherIcon(data.weather[0].main),
          });
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    // Removed geolocation functionality
    // You can call fetchWeatherData with specific coordinates or handle it differently

  }, []);

  const handleSearchWeather = async () => {
    if (location) {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=dce088c56173d4ff46072161100191e3&units=metric`);
        const data = await response.json();
        if (data.main) {
          setCurrentWeather({
            temp: `${Math.round(data.main.temp)}°C`, // Round to nearest integer
            condition: data.weather[0].description,
            icon: getWeatherIcon(data.weather[0].main),
          });
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
  };

  const handleButtonPress = (screen) => {
    navigation.navigate(screen)
  }

  const getCropCalendarTip = () => {
    const currentDate = new Date()
    const month = currentDate.getMonth()
    const tips = [
      "January: Plan your crop rotation for the year",
      "February: Start preparing seedbeds for early crops",
      "March: Begin planting cool-season crops",
      "April: Monitor soil temperature for warm-season crops",
      "May: Plant heat-loving crops as soil warms",
      "June: Implement pest control measures",
      "July: Maintain regular watering schedule",
      "August: Start planning for fall crops",
      "September: Plant fall and winter crops",
      "October: Harvest and store late-season crops",
      "November: Prepare soil for next season",
      "December: Maintain and repair farm equipment",
    ]
    return tips[month]
  }

  const renderButton = (label, screen, icon) => (
    <TouchableOpacity style={styles.button} onPress={() => handleButtonPress(screen)} activeOpacity={0.8}>
      <Text style={styles.buttonIcon}>{icon}</Text>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  )

  const toggleHelpDrawer = () => {
    setIsHelpDrawerVisible(!isHelpDrawerVisible)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, Farmer!</Text>
        <Text style={styles.subtitle}>Your agricultural companion</Text>
      </View>

      <View style={styles.weatherCard}>
        <Text style={styles.weatherTitle}>Today's Weather</Text>
        <View style={styles.currentWeather}>
          <Text style={styles.weatherIcon}>{currentWeather.icon}</Text>
          <View>
            <Text style={styles.weatherTemp}>{currentWeather.temp}</Text>
            <Text style={styles.weatherCondition}>{currentWeather.condition}</Text>
          </View>
        </View>
      </View>

      {/* Changed to a button that looks like Search and Need Help */}
      <TouchableOpacity style={styles.locationButton} onPress={() => {}}>
        <Text style={styles.buttonCommonText}>Enter Location</Text>
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearchWeather}>
        <Text style={styles.buttonCommonText}>Search</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>What would you like to do?</Text>

      <View style={styles.buttonContainer}>
        {renderButton("Cultivation Guide", "CultivationGuidance", "🌱")}
        {renderButton("Market Insights", "MarketDataInsights", "📊")}
        {renderButton("Manage Profile", "Profile", "👤")}
        {renderButton("Disease Detection", "DiseasesDetection", "🔬")}
        {renderButton("Fertilizer Tips", "FertilizerRecommendation", "🧪")}
      </View>

      <View style={styles.quickTips}>
        <Text style={styles.quickTipsTitle}>Quick Tip:</Text>
        <Text style={styles.calendarInfo}>{getCropCalendarTip()}</Text>
      </View>

      <TouchableOpacity style={styles.helpButton} onPress={toggleHelpDrawer}>
        <Text style={styles.buttonCommonText}>Need Help?</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={isHelpDrawerVisible} onRequestClose={toggleHelpDrawer}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={toggleHelpDrawer}>
          <View style={styles.helpDrawer}>
            <Text style={styles.helpDrawerTitle}>Contact Information</Text>
            <Text style={styles.helpDrawerSubtitle}>If you need any assistance, Please Contact Us </Text>
            <Text style={styles.helpDrawerText}>Email: ahmadali@gmail.com</Text>
            <Text style={styles.helpDrawerText}>Phone: +1 (555) 123-4567</Text>
            
            {/* Added more content to make the modal longer */}
            <Text style={styles.helpDrawerSubtitle}>Frequently Asked Questions</Text>
            <Text style={styles.helpDrawerQuestion}>How do I update my profile?</Text>
            <Text style={styles.helpDrawerText}>Go to the "Manage Profile" section from the dashboard to update your information.</Text>
            
            <Text style={styles.helpDrawerQuestion}>How accurate is the weather information?</Text>
            <Text style={styles.helpDrawerText}>Weather data is sourced from OpenWeatherMap and is updated regularly for accuracy.</Text>
            
            <Text style={styles.helpDrawerQuestion}>Can I get offline access to cultivation guides?</Text>
            <Text style={styles.helpDrawerText}>Yes, you can download guides for offline use from the Cultivation Guide section.</Text>
            
            <TouchableOpacity style={styles.closeButton} onPress={toggleHelpDrawer}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8f0",
  },
  header: {
    backgroundColor: "#27ae60",
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#e8f8e8",
    textAlign: "center",
    marginTop: 5,
  },
  weatherCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    margin: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d5c38",
    marginBottom: 10,
  },
  currentWeather: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  weatherIcon: {
    fontSize: 60,
    marginRight: 20,
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2d5c38",
  },
  weatherCondition: {
    fontSize: 18,
    color: "#4a4a4a",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d5c38",
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  button: {
    backgroundColor: "#fff",
    width: width * 0.4,
    aspectRatio: 1,
    borderRadius: 20,
    margin: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d5c38",
    textAlign: "center",
  },
  quickTips: {
    backgroundColor: "#e8f8f0",
    borderRadius: 15,
    padding: 15,
    margin: 15,
  },
  quickTipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d5c38",
    marginBottom: 5,
  },
  calendarInfo: {
    fontSize: 16,
    color: "#4a4a4a",
  },
  // Common button style for all action buttons
  buttonCommonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    

  },
  // New location button that matches Search and Need Help
 // locationButton: {
    //backgroundColor: "#27ae60",
    //borderRadius: 25,
    //padding: 15,
    //marginHorizontal: 20,
    //marginTop: 20,
    //marginBottom: 10,
    //alignItems: "center",
  //},
  helpButton: {
    backgroundColor: "#27ae60",
    borderRadius: 25,
    padding: 15,
    margin: 20,
    alignItems: "center",
  },
  searchButton: {
    backgroundColor: "#27ae60",
    borderRadius: 25,
    padding: 15,
    margin: 20,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  helpDrawer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400, // Increased from 200 to make it longer
    maxHeight: '80%', // Added to ensure it doesn't take up the entire screen
  },
  helpDrawerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d5c38",
    marginBottom: 15,
  },
  helpDrawerSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d5c38",
    marginTop: 15,
    marginBottom: 10,
  },
  helpDrawerQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d5c38",
    marginTop: 10,
    marginBottom: 5,
  },
  helpDrawerText: {
    fontSize: 16,
    color: "#4a4a4a",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#27ae60",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
})

export default Dashboard