import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { db } from "../config";
import { ref, onValue } from "firebase/database";
import {
  Svg,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { MyStore } from "./my-store";

const Gauge = ({ value, label }) => {
  const radius = 80;
  const strokeWidth = 15; // Increased stroke width for a better visual impact
  const max = label === "BPM" ? 180 : 100; // Simplified logic
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;

  // Define color based on the value
  const isHealthy = label === "BPM" ? value >= 70 && value <= 120 : value > 95;
  const gaugeColor = isHealthy ? "#34c759" : "#ff3b30"; // Using iOS system colors for health

  return (
    <View style={styles.gaugeContainer}>
      <Svg width={radius * 2} height={radius * 2}>
        <Defs>
          <LinearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#6ee7b7" />
            <Stop offset="100%" stopColor={gaugeColor} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          fill="none"
          stroke="#eee"
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${circumference}`}
        />
        <SvgText
          x={radius}
          y={radius + 10}
          textAnchor="middle"
          fontSize="16"
          fill="#666"
        >
          {label}
        </SvgText>
        <SvgText
          x={radius}
          y={radius - 10}
          textAnchor="middle"
          fontSize="22"
          fontWeight="bold"
          fill={gaugeColor}
        >
          {value}
        </SvgText>
      </Svg>
    </View>
  );
};

const Vitals = ({ route }) => {
  // const { id } = route.params;
  const { id } = useContext(MyStore);
  const [heartRate, setHeartRate] = useState(null);
  const [spo2, setSpo2] = useState(null);

  useEffect(() => {
    const vitalsRef = ref(db, `${id}`);
    const unsubscribe = onValue(vitalsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setHeartRate(data.heart_rate || "N/A");
        setSpo2(data.SpO2 || "N/A");
      }
    });

    return () => unsubscribe();
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <Text style={styles.header}>Heart Rate</Text>
        <Gauge value={heartRate} label="BPM" />
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.header}>SpO2</Text>
        <Gauge value={spo2} label="%" />
      </View>
    </View>
  );
};

export default Vitals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F9FF",
  },
  header: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 10,
  },
  dataContainer: {
    backgroundColor: "#f9f9f9",
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: "#000",
    shadowOffset: { height: 0, width: 0 },
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  gaugeContainer: {
    marginBottom: 40,
  },
});
