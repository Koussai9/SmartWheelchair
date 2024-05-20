import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import SelectImage from "./images/selectcomp.png";
import Icon from "react-native-vector-icons/MaterialIcons";

const StepSelection = ({ navigation }) => {
  const handleNavigateToFormulaire = () => {
    navigation.navigate("AddData");
  };

  const handleNavigateToVitals = () => {
    navigation.navigate("Vitals");
  };

  const handleNavigateToGPS = () => {
    navigation.navigate("GPS");
  };

  const handleNavigateToPassword = () => {
    navigation.navigate("Password");
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  // useEffect(() => {
  //   const removePreviousScreenListener = navigation.addListener(
  //     "beforeRemove",
  //     (e) => {
  //       e.preventDefault();
  //     }
  //   );

  //   return removePreviousScreenListener;
  // }, []);

  return (
    <View style={styles.container}>
      <Image source={SelectImage} style={styles.image} />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNavigateToPassword}
        >
          <Text style={styles.buttonText}>Change Password</Text>
          <Icon name="lock" size={24} color="white" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNavigateToFormulaire}
        >
          <Text style={styles.buttonText}>Medical Record</Text>
          <Icon
            name="folder-open"
            size={24}
            color="white"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNavigateToVitals}
        >
          <Text style={styles.buttonText}>Vitals</Text>
          <Icon name="favorite" size={24} color="white" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNavigateToGPS}>
          <Text style={styles.buttonText}>GPS</Text>
          <Icon
            name="location-on"
            size={24}
            color="white"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
          <Icon
            name="exit-to-app"
            size={24}
            color="white"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#BEDAE5",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 60,
  },
  button: {
    backgroundColor: "#002C44",
    padding: 15,
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 10,
  },
});

export default StepSelection;
