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
import { getDatabase, ref, get, set } from "firebase/database";
import { MyStore } from "./my-store";

const Password = ({ navigation, route }) => {
  // const { id } = route.params;
  const { id } = useContext(MyStore);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    try {
      const db = getDatabase();
      const passRef = ref(db, `${id}/Pass`);
      const passSnapshot = await get(passRef);

      if (passSnapshot.exists()) {
        const existingPassword = passSnapshot.val();
        if (currentPassword !== existingPassword) {
          Alert.alert("Error", "Current password is incorrect.");
          return;
        }
      } else {
        Alert.alert("Error", "Password not found in database.");
        return;
      }

      await set(passRef, newPassword);
      Alert.alert("Success", "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Error", "Failed to update password.");
      console.error("Firebase update failed: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("./images/pass.png")} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        placeholderTextColor="#ccc"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#ccc"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        placeholderTextColor="#ccc"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Password;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  input: {
    borderWidth: 2,
    borderColor: "#8FD8D9",
    padding: 15,
    fontSize: 16,
    color: "black",
    borderRadius: 10,
    width: "90%",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#150101",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    width: "90%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
