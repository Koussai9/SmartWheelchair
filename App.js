import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  Image,
} from "react-native";
import { getDatabase, ref, get } from "firebase/database";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddData from "./src/Formulaire";
import StepSelection from "./src/StepSelection";
import Vitals from "./src/Vitals";
import GPS from "./src/Gps";
import Logo from "./src/images/logo.png";
import Password from "./src/Password";
import MarkedLocations from "./src/MarkedLocations";
import MyProvider, { MyStore } from "./src/my-store";
import Notifications from "./src/Notifications";

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  const { id, setId } = useContext(MyStore);

  const [inputPassword, setInputPassword] = useState("");

  const checkIdAndNavigate = async () => {
    console.log(id);
    if (id.trim()) {
      const db = getDatabase();
      const idRef = ref(db, `${id}`);
      try {
        const snapshot = await get(idRef);
        if (snapshot.exists()) {
          const { Pass } = snapshot.val();
          if (Pass === inputPassword) {
            // navigation.navigate("Notification", { id: inputId });
            navigation.navigate("Notification");
            navigation.navigate("StepSelection");
          } else {
            Alert.alert(
              "Incorrect Password",
              "Please enter the correct password."
            );
          }
        } else {
          Alert.alert("ID Not Found", "Please verify your ID.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to check ID. Please try again.");
        console.error("Firebase read failed: ", error);
      }
    } else {
      Alert.alert("Invalid Input", "Please enter a valid ID.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <View style={styles.inputContainer}>
        <Text style={styles.header}>Enter Your Login Data</Text>
        <TextInput
          style={styles.input}
          placeholder="ID"
          placeholderTextColor="#aaa"
          value={id}
          onChangeText={setId}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={inputPassword}
          onChangeText={setInputPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={checkIdAndNavigate}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <MyProvider>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddData" component={AddData} />
          <Stack.Screen name="StepSelection" component={StepSelection} />
          <Stack.Screen name="Vitals" component={Vitals} />
          <Stack.Screen name="GPS" component={GPS} />
          <Stack.Screen name="Password" component={Password} />
          <Stack.Screen name="MarkedLocations" component={MarkedLocations} />
          <Stack.Screen name="Notification" component={Notifications} />
        </Stack.Navigator>
      </MyProvider>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#05303F",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 22,
    color: "white",
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#0290A8",
    padding: 10,
    fontSize: 18,
    color: "white",
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 97,
  },
  inputContainer: {
    width: "80%",
    marginVertical: 60,
  },
  button: {
    backgroundColor: "#0290A8",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
