import { Button, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { ref, onValue } from "firebase/database";
import { db } from "../config";
import { MyStore } from "./my-store";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function requestPermissionsAsync() {
  return Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
}

const Notification = () => {
  const [notifData, setNotifData] = useState({
    idSender: "",
    userName: "",
  });
  const { id } = useContext(MyStore);
  const [notificationInterval, setNotificationInterval] = useState(null);

  const notifHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Alert!!",
        body: "Check your cardio",
        sound: "default",
        vibrate: [0, 250, 250, 250],
        data: {
          idSender: "1",
          userName: "Firas",
        },
      },
      trigger: { seconds: 2 },
    });
  };

  useEffect(() => {
    const cardioRef = ref(db, `${id}/cardio`);

    const unsubscribe = onValue(cardioRef, (snapshot) => {
      if (snapshot.exists()) {
        const cardioValue = snapshot.val();
        console.log("Cardio value:", cardioValue);
        if (cardioValue === 1) {
          if (!notificationInterval) {
            const interval = setInterval(() => {
              notifHandler();
            }, 10000);
            setNotificationInterval(interval);
          }
        } else {
          console.log("No need for notification");
          if (notificationInterval) {
            clearInterval(notificationInterval);
            setNotificationInterval(null);
          }
        }
      } else {
        console.log("No data available");
      }
    });

    return () => {
      unsubscribe();
      if (notificationInterval) {
        clearInterval(notificationInterval);
      }
    };
  }, [id, notificationInterval]);

  useEffect(() => {
    Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    }).then((ss) => {
      //console.log("************", ss);
    });
  }, []);

  return (
    <View style={styles.center}>
      <Button title="Test Notif" onPress={notifHandler} />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
