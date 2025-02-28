"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

const CultivationGuidance = () => {
  const [selectedMonth, setSelectedMonth] = useState("Jan-Mar")
  const [currentStep, setCurrentStep] = useState(0)

  const monthGroups = [
    { name: "Jan-Mar", steps: [0, 1, 2] },
    { name: "Apr-Jun", steps: [3, 4, 5] },
    { name: "Jul-Sep", steps: [6, 7] },
    { name: "Oct-Dec", steps: [8, 9] },
  ]

  const currentMonthGroup = monthGroups.find((group) => group.name === selectedMonth)
  const currentSteps = currentMonthGroup ? currentMonthGroup.steps : []

  const handleNext = () => {
    if (currentStep < currentSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cultivation Guidance</Text>
        <Text style={styles.headerSubtitle}>Your step-by-step guide to a bountiful potato harvest</Text>
      </View>

      <View style={styles.monthSelector}>
        {monthGroups.map((group) => (
          <TouchableOpacity
            key={group.name}
            style={[styles.monthButton, selectedMonth === group.name && styles.selectedMonthButton]}
            onPress={() => {
              setSelectedMonth(group.name)
              setCurrentStep(0)
            }}
          >
            <Text style={[styles.monthButtonText, selectedMonth === group.name && styles.selectedMonthButtonText]}>
              {group.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {currentSteps.length > 0 && (
        <View style={styles.stepContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{sections[currentSteps[currentStep]].title}</Text>
            <Text style={styles.purposeTitle}>Purpose:</Text>
            <Text style={styles.content}>{sections[currentSteps[currentStep]].purpose}</Text>
            <Text style={styles.stepsTitle}>Steps:</Text>
            {sections[currentSteps[currentStep]].steps.map((step, index) => (
              <Text key={index} style={styles.content}>
                {`${index + 1}. ${step}`}
              </Text>
            ))}
            <Image source={sections[currentSteps[currentStep]].image} style={styles.image} />
          </View>

          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[styles.navButton, currentStep === 0 && styles.disabledButton]}
              onPress={handlePrevious}
              disabled={currentStep === 0}
            >
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, currentStep === currentSteps.length - 1 && styles.disabledButton]}
              onPress={handleNext}
              disabled={currentStep === currentSteps.length - 1}
            >
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

const sections = [
  {
    title: "1. Land Preparation",
    purpose: "Ensure the soil is loose, well-drained, and rich in organic matter.",
    steps: [
      "Plow the field to a depth of 8-12 inches to break clods.",
      "Remove weeds and debris.",
      "Apply organic manure or compost at least two weeks before planting.",
      "Ensure soil pH is between 5.5 and 6.5.",
    ],
    image: require("./assets/c1.jpg"),
  },
  {
    title: "2. Seed Selection and Treatment",
    purpose: "Use healthy and disease-free seed tubers for high yield.",
    steps: [
      "Select certified, sprout-free, medium-sized seed tubers (40-50g each).",
      "Treat tubers with fungicides (e.g., Mancozeb) to prevent diseases like late blight.",
      "Allow seeds to sprout in indirect sunlight for 2-3 days before planting.",
    ],
    image: require("./assets/c2.jpg"),
  },
  {
    title: "3. Planting",
    purpose: "Optimal spacing ensures good growth and prevents diseases.",
    steps: [
      "Plant tubers 3-4 inches deep with sprouts facing upwards.",
      "Maintain a spacing of 12-15 inches between tubers and 24-30 inches between rows.",
      "Cover the tubers with soil gently to avoid damage.",
    ],
    image: require("./assets/c3.jpg"),
  },
  {
    title: "4. Irrigation",
    purpose: "Maintain soil moisture but avoid waterlogging.",
    steps: [
      "Water the field immediately after planting.",
      "Irrigate once a week or when the topsoil appears dry.",
      "Reduce watering during the tuber bulking stage to prevent fungal diseases.",
    ],
    image: require("./assets/c4.jpg"),
  },
  {
    title: "5. Fertilizer Application",
    purpose: "Provide necessary nutrients for plant growth.",
    steps: [
      "Apply nitrogen (N), phosphorus (P), and potassium (K) in a 2:1:1 ratio.",
      "Use fertilizers at planting, then top-dress 30 days after sprouting.",
      "Avoid over-fertilization to prevent excessive foliage and reduced tuber growth.",
    ],
    image: require("./assets/c5.jpg"),
  },
  {
    title: "6. Weed and Pest Management",
    purpose: "Minimize competition and protect plants from damage.",
    steps: [
      "Use mulching to suppress weeds.",
      "Apply selective herbicides as per agricultural guidelines.",
      "Scout for pests like aphids and Colorado potato beetles weekly.",
      "Use biological or chemical control as needed.",
    ],
    image: require("./assets/c6.jpg"),
  },
  {
    title: "7. Disease Monitoring",
    purpose: "Early detection prevents severe crop loss.",
    steps: [
      "Look for symptoms of diseases like late blight (brown spots on leaves).",
      "Use disease-resistant potato varieties if possible.",
      "Spray recommended fungicides at early stages.",
    ],
    image: require("./assets/c7.jpg"),
  },
  {
    title: "8. Tuber Bulking",
    purpose: "Maximize tuber size and quality.",
    steps: [
      "Stop irrigation 2-3 weeks before harvesting.",
      "Monitor plant health to ensure good tuber growth.",
      "Hill up soil around plants to protect tubers from sun exposure.",
    ],
    image: require("./assets/c8.jpg"),
  },
  {
    title: "9. Harvesting",
    purpose: "Harvest tubers at the right maturity for better quality and storage.",
    steps: [
      "Harvest 90-120 days after planting or when leaves turn yellow and dry.",
      "Use a fork or mechanical harvester to lift tubers without damaging them.",
      "Dry harvested tubers in shade for 2-3 days before storage.",
    ],
    image: require("./assets/c9.jpg"),
  },
  {
    title: "10. Storage",
    purpose: "Prevent spoilage and maintain quality.",
    steps: [
      "Store tubers in a cool (2-4°C), dark, and well-ventilated place.",
      "Avoid storing damaged or diseased tubers.",
      "Use sprout inhibitors if planning long-term storage.",
    ],
    image: require("./assets/c10.jpg"),
  },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#27ae60",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#ecf0f1",
    marginTop: 10,
    textAlign: "center",
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#ecf0f1",
  },
  monthButton: {
    padding: 10,
    borderRadius: 5,
  },
  selectedMonthButton: {
    backgroundColor: "#27ae60",
  },
  monthButtonText: {
    color: "#34495e",
    fontWeight: "bold",
  },
  selectedMonthButtonText: {
    color: "#fff",
  },
  stepContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2980b9",
    marginBottom: 10,
  },
  purposeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#16a085",
    marginBottom: 5,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e67e22",
    marginTop: 10,
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 5,
    lineHeight: 22,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    backgroundColor: "#27ae60",
    padding: 10,
    borderRadius: 5,
    width: width * 0.4,
    alignItems: "center",
  },
  navButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#95a5a6",
  },
})

export default CultivationGuidance

