"use client"

import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from "react-native"
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg"

const MarketDataInsights = () => {
  const [selectedCity, setSelectedCity] = useState(null)
  const [fadeAnim] = useState(new Animated.Value(0))

  const windowWidth = Dimensions.get("window").width
  const chartWidth = windowWidth - 64
  const chartHeight = 150

  const cityMarketData = [
    {
      name: "Lahore",
      currentPrice: 60,
      historicalData: [
        { month: "Jan", price: 55 },
        { month: "Feb", price: 60 },
        { month: "Mar", price: 65 },
        { month: "Apr", price: 68 },
        { month: "May", price: 70 },
      ],
    },
    {
      name: "Karachi",
      currentPrice: 57,
      historicalData: [
        { month: "Jan", price: 55 },
        { month: "Feb", price: 53 },
        { month: "Mar", price: 58 },
        { month: "Apr", price: 60 },
        { month: "May", price: 65 },
      ],
    },
    {
      name: "Peshawar",
      currentPrice: 50,
      historicalData: [
        { month: "Jan", price: 50 },
        { month: "Feb", price: 45 },
        { month: "Mar", price: 48 },
        { month: "Apr", price: 55 },
        { month: "May", price: 60 },
      ],
    },
    {
      name: "Quetta",
      currentPrice: 55,
      historicalData: [
        { month: "Jan", price: 55 },
        { month: "Feb", price: 60 },
        { month: "Mar", price: 55 },
        { month: "Apr", price: 58 },
        { month: "May", price: 63 },
      ],
    },
    {
      name: "Rawalpindi",
      currentPrice: 65,
      historicalData: [
        { month: "Jan", price: 50 },
        { month: "Feb", price: 60 },
        { month: "Mar", price: 65 },
        { month: "Apr", price: 68 },
        { month: "May", price: 70 },
      ],
    },
    {
      name: "Faisalabad",
      currentPrice: 48,
      historicalData: [
        { month: "Jan", price: 50 },
        { month: "Feb", price: 53 },
        { month: "Mar", price: 48 },
        { month: "Apr", price: 60 },
        { month: "May", price: 55 },
      ],
    },
    {
      name: "Multan",
      currentPrice: 60,
      historicalData: [
        { month: "Jan", price: 50 },
        { month: "Feb", price: 60 },
        { month: "Mar", price: 60 },
        { month: "Apr", price: 65 },
        { month: "May", price: 70 },
      ],
    },
    {
      name: "Hyderabad",
      currentPrice: 63,
      historicalData: [
        { month: "Jan", price: 60 },
        { month: "Feb", price: 50 },
        { month: "Mar", price: 55 },
        { month: "Apr", price: 60 },
        { month: "May", price: 65 },
      ],
    },
    {
      name: "Sialkot",
      currentPrice: 50,
      historicalData: [
        { month: "Jan", price: 40 },
        { month: "Feb", price: 45 },
        { month: "Mar", price: 50 },
        { month: "Apr", price: 45 },
        { month: "May", price: 55 },
      ],
    },
    {
      name: "Abbottabad",
      currentPrice: 45,
      historicalData: [
        { month: "Jan", price: 50 },
        { month: "Feb", price: 45 },
        { month: "Mar", price: 40 },
        { month: "Apr", price: 40 },
        { month: "May", price: 45 },
      ],
    },
  ]

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  const toggleCity = (index) => {
    setSelectedCity(selectedCity === index ? null : index)
  }

  const renderHistoricalChart = (historicalData) => {
    const maxPrice = Math.max(...historicalData.map((d) => d.price))
    const barWidth = (chartWidth - 60) / historicalData.length
    const barSpacing = 10
    const scaleFactor = (chartHeight - 40) / maxPrice

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Historical Prices (Last 5 Months)</Text>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Y-axis line */}
          <Line x1="30" y1="10" x2="30" y2={chartHeight - 20} stroke="#ecf0f1" strokeWidth="1" />

          {/* X-axis line */}
          <Line
            x1="30"
            y1={chartHeight - 20}
            x2={chartWidth - 10}
            y2={chartHeight - 20}
            stroke="#ecf0f1"
            strokeWidth="1"
          />

          {historicalData.map((data, index) => {
            const barHeight = data.price * scaleFactor
            const x = 40 + index * (barWidth + barSpacing)
            return (
              <React.Fragment key={index}>
                {/* Bar */}
                <Rect
                  x={x}
                  y={chartHeight - 20 - barHeight}
                  width={barWidth - barSpacing}
                  height={barHeight}
                  fill="#27ae60"
                  opacity="0.8"
                />

                {/* Price label */}
                <SvgText
                  x={x + (barWidth - barSpacing) / 2}
                  y={chartHeight - 25 - barHeight}
                  fill="#2c3e50"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {data.price}
                </SvgText>

                {/* Month label */}
                <SvgText
                  x={x + (barWidth - barSpacing) / 2}
                  y={chartHeight - 5}
                  fill="#7f8c8d"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {data.month}
                </SvgText>
              </React.Fragment>
            )
          })}
        </Svg>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.headerTitle}>Market Insights</Text>
        <Text style={styles.headerSubtitle}>Your Gateway to Smart Market Analysis</Text>
      </Animated.View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>10</Text>
          <Text style={styles.statLabel}>Cities</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Months</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24/7</Text>
          <Text style={styles.statLabel}>Updates</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>City-wise Market Data</Text>
        {cityMarketData.map((city, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.cityCard, selectedCity === index && styles.selectedCityCard]}
            onPress={() => toggleCity(index)}
            activeOpacity={0.7}
          >
            <View style={styles.cityHeader}>
              <Text style={styles.cityTitle}>{city.name}</Text>
              <View style={styles.priceTag}>
                <Text style={styles.priceTagText}>Average: {city.currentPrice}</Text>
              </View>
            </View>

            {renderHistoricalChart(city.historicalData)}

            {selectedCity === index && (
              <View style={styles.cityDetails}>
                <View style={styles.trendIndicator}>
                  <Text style={styles.trendText}>
                    Trend: {city.historicalData[4].price > city.historicalData[0].price ? "↗️ Rising" : "↘️ Falling"}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#3498db",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e6e6e6",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 10,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  statLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  cityCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCityCard: {
    borderColor: "#3498db",
    borderWidth: 2,
  },
  cityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  priceTag: {
    backgroundColor: "#ecf0f1",
    borderRadius: 4,
    padding: 5,
  },
  priceTagText: {
    fontSize: 14,
    color: "#2c3e50",
  },
  cityDetails: {
    marginTop: 10,
  },
  trendIndicator: {
    marginTop: 10,
    backgroundColor: "#ecf0f1",
    borderRadius: 4,
    padding: 5,
    alignSelf: "flex-start",
  },
  trendText: {
    fontSize: 14,
    color: "#2c3e50",
  },
  chartContainer: {
    marginTop: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
})

export default MarketDataInsights

