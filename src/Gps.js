import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../config";
import { ref, onValue } from "firebase/database";
import MapView, { Marker } from "react-native-maps";
import { MyStore } from "./my-store";

const GPS = ({ route }) => {
  // const { id } = route.params;
  const { id } = useContext(MyStore);
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const navigation = useNavigation();

  useEffect(() => {
    const GPSRef = ref(db, `${id}`);
    const unsubscribe = onValue(GPSRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lat = parseFloat(data.LAT);
        const lng = parseFloat(data.LNG);
        if (!isNaN(lat) && !isNaN(lng)) {
          setCoordinates({
            latitude: lat,
            longitude: lng,
          });
        }
      } else {
        console.log("No data available");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const navigateToMarkedLocations = () => {
    navigation.navigate("MarkedLocations", { id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LIVE LOCATION</Text>
      <View style={styles.dataContainer}>
        <Text style={styles.dataLabel}>Latitude:</Text>
        <Text style={styles.dataValue}>
          {coordinates.latitude || "Loading..."}
        </Text>
        <Text style={styles.dataLabel}>Longitude:</Text>
        <Text style={styles.dataValue}>
          {coordinates.longitude || "Loading..."}
        </Text>
      </View>
      {coordinates.latitude && coordinates.longitude && (
        <MapView
          style={styles.map}
          region={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
        >
          <Marker coordinate={coordinates} />
        </MapView>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={navigateToMarkedLocations}
      >
        <Text style={styles.buttonText}>View Marked Locations</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GPS;

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
    marginBottom: 20,
  },
  dataContainer: {
    backgroundColor: "#FFF",
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { height: 0, width: 0 },
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: "100%",
  },
  dataLabel: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
  },
  dataValue: {
    fontSize: 16,
    marginBottom: 10,
    color: "#444",
  },
  map: {
    width: Dimensions.get("window").width - 40,
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#0290A8",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 40,
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
