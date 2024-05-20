import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { db } from "../config";
import { ref, onValue, update, remove } from "firebase/database";
import Icon from "react-native-vector-icons/FontAwesome";
import { MyStore } from "./my-store";

const MarkedLocations = ({ route }) => {
  // const { id } = route.params;
  const { id } = useContext(MyStore);
  const [markedLocations, setMarkedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLat, setNewLat] = useState("");
  const [newLng, setNewLng] = useState("");

  useEffect(() => {
    const markedLocationsRef = ref(db, `${id}/MarkedLocations`);
    const unsubscribe = onValue(markedLocationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const locationsArray = Object.keys(data).map((key) => ({
          id: key,
          location: key,
          LAT: data[key].LAT,
          LNG: data[key].LNG,
        }));
        setMarkedLocations(locationsArray);
      } else {
        console.log("No marked locations available");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleEditLocation = (location) => {
    setSelectedLocation(location);
    setModalVisible(true);
  };

  const handleDeleteLocation = (locationId) => {
    remove(ref(db, `${id}/MarkedLocations/${locationId}`))
      .then(() => {
        console.log("Location deleted successfully");
      })
      .catch((error) => console.error("Error deleting location:", error));
  };

  const handleAddLocation = () => {
    const lat = parseFloat(newLat);
    const lng = parseFloat(newLng);

    if (newLocationName && !isNaN(lat) && !isNaN(lng)) {
      const newLocationRef = ref(
        db,
        `${id}/MarkedLocations/${newLocationName}`
      );
      update(newLocationRef, {
        LAT: lat,
        LNG: lng,
      })
        .then(() => {
          console.log("New location added successfully");
          setNewLocationName("");
          setNewLat("");
          setNewLng("");
          setAddModalVisible(false);
        })
        .catch((error) =>
          console.error("Error adding new location:", error.message)
        );
    } else {
      console.log("Please enter valid latitude and longitude");
    }
  };

  const handleSaveChanges = () => {
    const lat = parseFloat(newLat);
    const lng = parseFloat(newLng);

    if (selectedLocation && !isNaN(lat) && !isNaN(lng)) {
      update(ref(db, `${id}/MarkedLocations/${selectedLocation}`), {
        LAT: lat,
        LNG: lng,
      })
        .then(() => {
          console.log("Location updated successfully");
          setModalVisible(false);
        })
        .catch((error) => console.error("Error updating location:", error));
    } else {
      console.log("Please enter valid latitude and longitude");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Marked Locations</Text>
        {markedLocations.map((location) => (
          <View key={location.id} style={styles.locationContainer}>
            <Text style={styles.locationLabel}>{location.location}</Text>
            <Text style={styles.locationData}>Latitude: {location.LAT}</Text>
            <Text style={styles.locationData}>Longitude: {location.LNG}</Text>
            <View style={styles.iconsContainer}>
              <TouchableOpacity onPress={() => handleEditLocation(location.id)}>
                <Icon name="edit" size={24} color="blue" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteLocation(location.id)}
              >
                <Icon name="trash" size={24} color="red" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Edit Location</Text>
              <TextInput
                style={styles.input}
                placeholder="New Latitude   "
                value={newLat}
                onChangeText={setNewLat}
              />
              <TextInput
                style={styles.input}
                placeholder="New Longitude"
                value={newLng}
                onChangeText={setNewLng}
              />
              <Button title="Save Changes" onPress={handleSaveChanges} />
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={addModalVisible}
          onRequestClose={() => setAddModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Add New Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Location Name"
                value={newLocationName}
                onChangeText={setNewLocationName}
              />
              <TextInput
                style={styles.input}
                placeholder="Latitude             "
                value={newLat}
                onChangeText={setNewLat}
              />
              <TextInput
                style={styles.input}
                placeholder="Longitude          "
                value={newLng}
                onChangeText={setNewLng}
              />
              <Button title="Add Location" onPress={handleAddLocation} />
            </View>
          </View>
        </Modal>
        <TouchableOpacity onPress={() => setAddModalVisible(true)}>
          <Icon name="plus" size={24} color="black" style={styles.plusIcon} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MarkedLocations;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
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
  locationContainer: {
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
  locationLabel: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
    marginBottom: 10,
  },
  locationData: {
    fontSize: 16,
    color: "#444",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  icon: {
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#DDE0E6",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 2,
    borderColor: "grey",
    backgroundColor: "#F5F9FF",
    padding: 21,
    fontSize: 18,
    borderRadius: 20,
    width: "100%",
    marginBottom: 20,
    elevation: 3,
  },
  plusIcon: {
    marginTop: 20,
  },
});
