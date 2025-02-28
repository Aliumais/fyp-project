"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Modal } from "react-native"

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

  const [weatherInfo, setWeatherInfo] = useState({
    current: { temp: "25°C", condition: "Sunny", icon: getWeatherIcon("Sunny") },
    forecast: [
      { day: "Mon", temp: "24°C", icon: getWeatherIcon("Cloudy") },
      { day: "Tue", temp: "26°C", icon: getWeatherIcon("Sunny") },
      { day: "Wed", temp: "23°C", icon: getWeatherIcon("Rainy") },
      { day: "Thu", temp: "25°C", icon: getWeatherIcon("Partly Cloudy") },
      { day: "Fri", temp: "27°C", icon: getWeatherIcon("Sunny") },
      { day: "Sat", temp: "26°C", icon: getWeatherIcon("Sunny") },
      { day: "Sun", temp: "24°C", icon: getWeatherIcon("Cloudy") },
    ],
  })
  const [isHelpDrawerVisible, setIsHelpDrawerVisible] = useState(false)

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
          <Text style={styles.weatherIcon}>{weatherInfo.current.icon}</Text>
          <View>
            <Text style={styles.weatherTemp}>{weatherInfo.current.temp}</Text>
            <Text style={styles.weatherCondition}>{weatherInfo.current.condition}</Text>
          </View>
        </View>
        <View style={styles.forecastContainer}>
          {weatherInfo.forecast.map((day, index) => (
            <View key={index} style={styles.forecastDay}>
              <Text style={styles.forecastDayText}>{day.day}</Text>
              <Text style={styles.forecastIcon}>{day.icon}</Text>
              <Text style={styles.forecastTemp}>{day.temp}</Text>
            </View>
          ))}
        </View>
      </View>

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
        <Text style={styles.helpButtonText}>Need Help?</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={isHelpDrawerVisible} onRequestClose={toggleHelpDrawer}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={toggleHelpDrawer}>
          <View style={styles.helpDrawer}>
            <Text style={styles.helpDrawerTitle}>Contact Information</Text>
            <Text style={styles.helpDrawerText}>Name: Ahmad Ali</Text>
            <Text style={styles.helpDrawerText}>Email: ahmadali@gmail.com</Text>
            <Text style={styles.helpDrawerText}>Phone: +1 (555) 123-4567</Text>
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
  forecastContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 15,
  },
  forecastDay: {
    alignItems: "center",
  },
  forecastDayText: {
    fontSize: 12,
    color: "#4a4a4a",
    marginBottom: 5,
  },
  forecastIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  forecastTemp: {
    fontSize: 14,
    color: "#2d5c38",
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
  helpButton: {
    backgroundColor: "#27ae60",
    borderRadius: 25,
    padding: 15,
    margin: 20,
    alignItems: "center",
  },
  helpButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
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
    minHeight: 200,
  },
  helpDrawerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d5c38",
    marginBottom: 15,
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
})

export default Dashboard

