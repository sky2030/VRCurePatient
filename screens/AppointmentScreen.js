import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
const screenWidth = Math.round(Dimensions.get("window").width);
import AsyncStorage from "@react-native-community/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { TextInput, Button } from "react-native-paper";
import moment from "moment-timezone";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from "@expo/vector-icons";

const AppointmentScreen = ({ navigation, route }) => {
  let startDate = moment().startOf("day").format("x");
  let endDate = moment().endOf("day").format("x");
  const [appointmentList, setAppointmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [picture, setPicture] = useState("");
  const [modal, setModal] = useState(false);
  const [slotDate, setslotDate] = useState(moment().format("ll"));
  const [isDatePickerAvailable, setDatePickerAvailable] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setLoading(true);
      setAppointmentList([]);
      fetchData();
    });
    return unsubscribe;
  }, [route.params]);

  const updateStartEndDate = async (sdate) => {
    startDate = moment(sdate).startOf("day").format("x");
    endDate = moment(sdate).endOf("day").format("x");
    setslotDate(moment(sdate).startOf("day").format("ll"));
  };
  const handleDatePicker = (date) => {
    updateStartEndDate(date);
    setDatePickerAvailable(false);
    fetchData();
  };
  const fetchData = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    let URL = `${BASE_URL}doctorslots?day_from=${startDate}&day_to=${endDate}&self=true&status[]=booked`;
    console.log(URL);
    fetch(URL, {
      method: "GET",
      headers: { Authorization: userToken },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(JSON.stringify(results));
        setLoading(false);
        if (results.code == 200) {
          setAppointmentList(results.data);
        } else {
          Alert.alert(Alert_Title, results.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        Alert.alert(Alert_Title, SOMETHING_WENT_WRONG);
      });
  };
  const StringFromTime = (timevalue) => {
    if (timevalue <= 0) {
      return "12:00 AM";
    }
    const time = Number(timevalue) / 60000;
    let sdate = new Date();
    sdate.setHours(Math.floor(time / 60));
    sdate.setMinutes(time % 60);
    var returnValue = moment(sdate.getTime(), "x").format("hh:mm A");
    // DeviceInfo.is24Hour() ? "HH:mm" : "hh:mm A"

    return returnValue;
  };
  const statusForJoinConversation = (item) => {
    return 0;
  };
  const joinConversationPressed = async (item) => {
    ///v1/patient/appointment/join-now
    const userToken = await AsyncStorage.getItem("userToken");

    let URL = `${BASE_URL}appointment/join-now?appointment_id=${item.id}`;

    console.log(URL);
    fetch(URL, {
      method: "GET",
      headers: { Authorization: userToken },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        if (results.message != "success") {
          Alert.alert(Alert_Title, results.message);
        } else {
        }
      })
      .catch((err) => {
        Alert.alert(Alert_Title, SOMETHING_WENT_WRONG);
        // setAppointmentList(["jbhjbj", "jnjnj"])
      });
  };

  const pickFromGallery = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        //  aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      // console.log(data.base64);
      if (!data.cancelled) {
        //  handleUpload(newfile);
        setPicture(`data:image/jpeg;base64,${data.base64}`);
      }
    } else {
      Alert.alert(Alert_Title, "you need to give up permission to work");
    }
  };
  const pickFromCamera = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.allFiles,
        allowsEditing: true,
        //  aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      // console.log(data.base64);
      if (!data.cancelled) {
        //  handleUpload(newfile);
        setPicture(`data:image/jpeg;base64,${data.base64}`);
      }
    } else {
      Alert.alert(Alert_Title, "you need to give up permission to work");
    }
  };

  const handleUpload = (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "skyMedi");
    data.append("cloud_name", "skycloud55");

    fetch("https://api.cloudinary.com/v1_1/skycloud55/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPicture(data.url);
        setModal(false);
      })
      .catch((err) => {
        Alert.alert("error while uploading");
      });
  };

  const renderItem = (item, index) => {
    const joinConversationStatus = statusForJoinConversation(item);
    return (
      <View style={styles.MainCard}>
        <View style={styles.header}>
          <Text style={styles.whitebold}>{item.doctor.name}</Text>
        </View>
        <View style={styles.cardbody}>
          <View style={styles.cardsections}>
            <Text style={styles.cardtext}>Appointment date</Text>
            <Text style={styles.cardtext}>
              {moment(item.day_millis).format("ll")}
            </Text>
          </View>
          <View style={styles.cardsections}>
            <Text style={styles.cardtext}>Appointment Time</Text>
            <Text style={styles.cardtext}>
              {StringFromTime(item.time_millis)}
            </Text>
          </View>
          <View style={styles.cardsections}>
            <Text style={styles.cardtext}>Fees</Text>
            <Text style={styles.cardtext}>₹ {item.doctor.fee}/- </Text>
          </View>
        </View>
        <View style={styles.btnrow}>
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() =>
              navigation.navigate("ReportRepo", { appointment_id: item.id })
            }
            style={styles.cardbtn}
          >
            <Text style={styles.whitebold}> Report </Text>
          </TouchableOpacity>
          {joinConversationStatus == 1 && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => joinConversationPressed(item)}
              style={styles.cardDisabled}
            >
              <Text style={styles.whitebold}>Join Conversation </Text>
            </TouchableOpacity>
          )}
          {joinConversationStatus == 0 && (
            <TouchableOpacity
              onPress={() => joinConversationPressed(item)}
              style={styles.cardEnabled}
            >
              <Text style={styles.whitebold}>Join Conversation </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() =>
              navigation.navigate("PrescriptionHistory", {
                appointment_id: item.id,
              })
            }
            style={styles.cardbtn}
          >
            <Text style={styles.whitebold}> Prescriptions </Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => navigation.navigate("Prescription", { item })}
          style={styles.cardbtn}
        >
          <Text style={styles.whitebold}> Cancel Appointment </Text>
        </TouchableOpacity> */}
      </View>
    );

    {
      /* <TouchableOpacity
                activeOpacity={1}
                onPress={() => slotPressed(item, index)}
                style={{
                    margin: 10, backgroundColor: displayBGSlot(item.status), flex: 1,
                    justifyContent: "center"
                }}>
                <Text style={{ alignSelf: "center", fontSize: 13, color: "#eee" }}>{StringFromTime(item.time_millis)}</Text>
                <Text style={{ alignSelf: "center", fontSize: 14, color: "#eee", marginTop: 6 }}>
                    {(item.status).toUpperCase()}</Text>

            </TouchableOpacity> */
    }
  };
  return (
    <View
      style={{
        width: screenWidth - 20,
        flex: 1,
        marginTop: 20,
        alignSelf: "center",
      }}
    >
      <View style={styles.Subtitle}>
        <Text style={styles.toptext}>Upcoming Appointment on {slotDate}</Text>
        <TouchableOpacity
          style={{
            color: "#08211c",
            marginLeft: 10,
          }}
          onPress={() => setDatePickerAvailable(true)}
        >
          <AntDesign name="calendar" size={32} color="black" />
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerAvailable}
        mode="date"
        onConfirm={handleDatePicker}
        onCancel={() => setDatePickerAvailable(false)}
      />
      <FlatList
        data={appointmentList}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={(item, index) => item.id}
        onRefresh={() => fetchData()}
        refreshing={loading}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.modalButtonView}>
            <Button
              icon="camera"
              theme={theme}
              mode="contained"
              onPress={() => pickFromCamera()}
            >
              camera
            </Button>
            <Button
              icon="image-area"
              mode="contained"
              theme={theme}
              onPress={() => pickFromGallery()}
            >
              gallery
            </Button>
          </View>
          <View style={styles.modalButtonView}>
            <Button
              icon="upload"
              theme={theme}
              mode="contained"
              onPress={() => setModal(false)}
            >
              Upload
            </Button>
          </View>
          <Button theme={theme} onPress={() => setModal(false)}>
            cancel
          </Button>
        </View>
      </Modal>
    </View>
  );
};

const theme = {
  colors: {
    primary: "#006aff",
  },
};

export default AppointmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  Subtitle: {
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  toptext: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  head: {
    backgroundColor: "white",
    padding: 20,
    height: 60,
    width: "100%",
  },

  whitebold: {
    color: "white",
    // marginVertical: 5,
    fontWeight: "500",
    textAlign: "center",
    alignSelf: "center",
  },

  cardtext: {
    color: "#4E557C",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
    marginTop: 8,
    marginLeft: 2,
  },

  header: {
    color: "white",
    backgroundColor: "#192161",
    fontWeight: "500",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: 30,
  },

  MainCard: {
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#E5F0ED",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: screenWidth - 20,
    marginBottom: 20,
  },
  cardDisabled: {
    flex: 1,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "gray",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    height: 35,
    justifyContent: "center",
  },
  cardEnabled: {
    flex: 1,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "green",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    height: 35,
    justifyContent: "center",
  },
  cardbtn: {
    flex: 1,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#192161",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 7,
    height: 35,
    justifyContent: "center",
  },
  Cancelbtn: {
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#192161",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    marginBottom: 10,
    marginHorizontal: 10,
  },

  btnrow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    height: 45,
    marginBottom: 5,
  },
  cardbody: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 10,
  },

  cardsections: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  modalView: {
    position: "absolute",
    bottom: 2,
    width: "100%",
    backgroundColor: "white",
  },
  modalButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
