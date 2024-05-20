import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Switch,
  Alert,
} from "react-native";
import { db } from "../config";
import { ref, get, set } from "firebase/database";
import { MyStore } from "./my-store";

const AddData = ({ route }) => {
  // const { id } = route.params;
  const { id } = useContext(MyStore);
  const [age, setAge] = useState("");
  const [asthma, setAsthma] = useState(false);
  const [diabetic, setDiabetic] = useState(false);
  const [kidneyDisease, setKidneyDisease] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const [cholesterol, setCholesterol] = useState("");
  const [gender, setGender] = useState(null);
  const [height, setHeight] = useState("");
  const [smoke, setSmoke] = useState(false);
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, id));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setAge(data.Age || "");
          setAsthma(data.Asthma === 1);
          setDiabetic(data.Diabetic === 1);
          setKidneyDisease(data.KidneyDisease === 1);
          setAlcohol(data.Alcohol === 1);
          setCholesterol(data.Cholesterol || "");
          setGender(data.Gender === 1 ? "male" : "female");
          setHeight(data.Height || "");
          setSmoke(data.Smoke === 1);
          setWeight(data.Weight || "");
        }
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };
    fetchData();
  }, [id]);

  const handleAddData = async () => {
    try {
      const snapshot = await get(ref(db, id));
      const existingData = snapshot.val();

      const newData = {
        Age: age,
        Asthma: asthma ? 1 : 0,
        Diabetic: diabetic ? 1 : 0,
        KidneyDisease: kidneyDisease ? 1 : 0,
        Alcohol: alcohol ? 1 : 0,
        Cholesterol: cholesterol,
        Gender: gender === "male" ? 1 : 2,
        Height: height,
        Smoke: smoke ? 1 : 0,
        Weight: weight,
      };

      const mergedData = { ...existingData, ...newData };
      await set(ref(db, id), mergedData);

      setAge("");
      setAsthma(false);
      setDiabetic(false);
      setKidneyDisease(false);
      setAlcohol(false);
      setCholesterol("");
      setGender(null);
      setHeight("");
      setSmoke(false);
      setWeight("");
    } catch (error) {
      console.error("Failed to add data to database: ", error);
      Alert.alert("Error", "Failed to add data to database. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Medical Record</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.switchContainer}>Gender</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Male"
            onPress={() => setGender("male")}
            color={gender === "male" ? "blue" : "grey"}
          />
          <Button
            title="Female"
            onPress={() => setGender("female")}
            color={gender === "female" ? "blue" : "grey"}
          />
        </View>
      </View>
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Cholesterol"
        value={cholesterol}
        onChangeText={setCholesterol}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.switchContainer}>
        <Text>Asthma</Text>
        <Switch value={asthma} onValueChange={setAsthma} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Diabetic</Text>
        <Switch value={diabetic} onValueChange={setDiabetic} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Kidney Disease</Text>
        <Switch value={kidneyDisease} onValueChange={setKidneyDisease} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Alcohol Consumption</Text>
        <Switch value={alcohol} onValueChange={setAlcohol} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Smoker</Text>
        <Switch value={smoke} onValueChange={setSmoke} />
      </View>

      <Button title="Add Data" onPress={handleAddData} />
    </View>
  );
};

export default AddData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F5F9FF",
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    width: 140,
  },
});
