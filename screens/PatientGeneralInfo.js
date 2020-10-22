import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Modal,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import moment from "moment-timezone";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import AsyncStorage from "@react-native-community/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

function PatientGeneralInfo({ navigation, route }) {
  const [id, setId] = useState(route.params.data._id);
  const [email, setemail] = useState(route.params.data.email);
  const [patient_name, setpatient_name] = useState(
    route.params.data.patient_name
  );
  const [mothers_name, setmothername] = useState(
    route.params.data.mothers_name
  );
  const [gender, setgender] = useState(route.params.data.gender);
  const [dob, setDOB] = useState(route.params.data.dob);
  const [picture, setPicture] = useState(route.params.data.picture);
  const [place, setplace] = useState(route.params.data.place);
  const [city, setcity] = useState(route.params.data.city);
  const [state, setstate] = useState(route.params.data.state);
  const [pincode, setpincode] = useState(route.params.data.pincode);
  const [weight, setweight] = useState(route.params.data.weight);
  const [height, setheight] = useState(route.params.data.height);
  const [isDatePickerAvailable, setDatePickerAvailable] = useState(false);
  const [modal, setModal] = useState(false);
  const [enableshift, setenableShift] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setemail(route.params.data.email);
      setpatient_name(route.params.data.patient_name);
      setmothername(route.params.data.mothers_name);
      setgender(route.params.data.gender);
      setDOB(route.params.data.dob);
      setPicture(route.params.data.picture);
      setplace(route.params.data.place);
      setcity(route.params.data.city);
      setstate(route.params.data.state);
      setpincode(route.params.data.pincode);
      setId(route.params.data._id);
      setweight(route.params.data.weight);
      setheight(route.params.data.height);
    });
    return unsubscribe;
  }, [route.params.data]);

  const handleDatePicker = (date) => {
    setDOB(moment(date).format("DD/MM/YYYY"));
    //updateDOB(date);
    setDatePickerAvailable(false);
  };

  const submitData = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const payload = {
      id,
      email,
      patient_name,
      mothers_name,
      gender,
      dob,
      weight,
      height,
      picture,
      place,
      city,
      state,
      pincode,
    };
    console.log(payload);
    fetch(BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.code == 200) {
          Alert.alert(`${patient_name} is Updated successfully`);
          navigation.goBack();
        } else {
          Alert.alert(Alert_Title, data.response);
        }
      })
      .catch((err) => {
        Alert.alert(Alert_Title, SOMETHING_WENT_WRONG);
      });
    setTimeout(() => {
      setemail("");
      setpatient_name("");
      setmothername("");
      setgender("");
      setDOB("");
      setPicture("");
      setplace("");
      setcity("");
      setstate("");
      setpincode("");
    }, 1000);
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
      Alert.alert("you need to give up permission to work");
    }
  };
  const pickFromCamera = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.allFiles,
        allowsEditing: true,
        //  aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });
      // console.log(data.base64);
      if (!data.cancelled) {
        //  handleUpload(newfile);
        setPicture(data.base64);
      }
    } else {
      Alert.alert("you need to give up permission to work");
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

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <MaterialIcons
          name="navigate-before"
          size={28}
          onPress={() => navigation.goBack()}
          style={styles.back}
        />

        <Text style={styles.headtext}>Update Details </Text>
        <MaterialCommunityIcons
          name="home-plus"
          size={30}
          color="white"
          onPress={() => navigation.navigate("Hospital")}
          style={{ position: "absolute", right: 10 }}
        />
      </View>
      <ScrollView>
        <KeyboardAvoidingView
          behavior="position"
          style={styles.root}
          enabled={enableshift}
        >
          <View style={styles.formHeader}>
            <DateTimePickerModal
              isVisible={isDatePickerAvailable}
              mode="date"
              onConfirm={handleDatePicker}
              onCancel={() => setDatePickerAvailable(false)}
            />
            <TextInput
              label="Full Name"
              style={styles.inputStyle}
              value={patient_name}
              onFocus={() => setenableShift(false)}
              theme={theme}
              mode="outlined"
              onChangeText={(text) => setpatient_name(text)}
            />

            <TextInput
              label="Email"
              style={styles.inputStyle}
              value={email}
              theme={theme}
              onFocus={() => setenableShift(false)}
              mode="outlined"
              onChangeText={(text) => setemail(text)}
            />
            <TextInput
              label="Mother Maiden Name"
              style={styles.inputStyle}
              value={mothers_name}
              theme={theme}
              onFocus={() => setenableShift(false)}
              //keyboardType="number-pad"
              mode="outlined"
              onChangeText={(text) => setmothername(text)}
            />
            <TextInput
              label="Gender"
              style={styles.inputStyle}
              value={gender}
              theme={theme}
              onFocus={() => setenableShift(false)}
              //keyboardType="number-pad"
              mode="outlined"
              onChangeText={(text) => setgender(text)}
            />
            <View style={styles.Subtitle}>
              <TextInput
                label="Date of Birth"
                style={styles.dobStyle}
                value={dob}
                theme={theme}
                onFocus={() => setenableShift(false)}
                //keyboardType="number-pad"
                mode="outlined"
                onChangeText={(text) => setDOB(text)}
              />
              <TouchableOpacity
                style={{
                  color: "#08211c",
                  marginLeft: 10,
                  flex: 1,
                }}
                onPress={() => setDatePickerAvailable(true)}
              >
                <AntDesign name="calendar" size={32} color="black" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row" }}>
              <TextInput
                label="Weight"
                style={styles.smallinput}
                value={weight}
                theme={theme}
                onFocus={() => setenableShift(true)}
                //keyboardType="number-pad"
                mode="outlined"
                onChangeText={(text) => setweight(text)}
              />
              <TextInput
                label="Height"
                style={styles.smallinput}
                value={height}
                theme={theme}
                onFocus={() => setenableShift(true)}
                //keyboardType="number-pad"
                mode="outlined"
                onChangeText={(text) => setheight(text)}
              />
            </View>
            <TextInput
              label="Address"
              style={styles.inputStyle}
              value={place}
              theme={theme}
              onFocus={() => setenableShift(true)}
              //keyboardType="number-pad"
              mode="outlined"
              onChangeText={(text) => setplace(text)}
            />
            <TextInput
              label="City"
              style={styles.inputStyle}
              value={city}
              theme={theme}
              onFocus={() => setenableShift(true)}
              //keyboardType="number-pad"
              mode="outlined"
              onChangeText={(text) => setcity(text)}
            />
            <TextInput
              label="State"
              style={styles.inputStyle}
              value={state}
              theme={theme}
              onFocus={() => setenableShift(true)}
              //keyboardType="number-pad"
              mode="outlined"
              onChangeText={(text) => setstate(text)}
            />
            <TextInput
              label="Pin Code"
              style={styles.inputStyle}
              value={pincode}
              theme={theme}
              onFocus={() => setenableShift(true)}
              //keyboardType="number-pad"
              mode="outlined"
              onChangeText={(text) => setpincode(text)}
            />
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <Button
                style={styles.uploadImage}
                icon={picture == "" ? "upload" : "check"}
                mode="contained"
                theme={theme}
                onPress={() => setModal(true)}
              >
                Upload Image
              </Button>

              <Button
                style={styles.uploadImage}
                icon="content-save"
                mode="contained"
                theme={theme}
                onPress={() => submitData()}
              >
                save
              </Button>
            </View>
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
                <Button theme={theme} onPress={() => setModal(false)}>
                  cancel
                </Button>
              </View>
            </Modal>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const theme = {
  colors: {
    primary: "#006aff",
  },
};
const styles = StyleSheet.create({
  head: {
    backgroundColor: "#21ada2",
    flexDirection: "row",
    height: 50,
    width: "100%",
    alignItems: "center",
  },
  Subtitle: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginHorizontal: 20,
    borderRadius: 5,
  },
  dobStyle: {
    margin: 2,
    flex: 2,
  },
  toptext: {
    fontSize: 15,
    fontWeight: "600",
    marginVertical: 15,
    marginHorizontal: 10,
  },
  back: {
    padding: 10,
    color: "white",
  },
  headtext: {
    color: "white",
    fontSize: 21,
    fontWeight: "500",
    textAlign: "center",
    width: "80%",
  },
  root: {
    flex: 1,
    width: "100%",
  },
  formHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  buttonNew: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonheader: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginRight: 50,
  },

  container: {
    flex: 1,
  },

  inputStyle: {
    margin: 2,
    width: "90%",
  },
  smallinput: {
    marginHorizontal: 20,
    marginVertical: 2,
    flex: 1,
  },
  uploadImage: {
    margin: 5,
    padding: 5,
    // marginVertical: 10,
    width: "45%",
  },
  form: {
    width: "100%",
    marginLeft: 25,
  },
  modalView: {
    position: "absolute",
    bottom: 2,
    width: "100%",
    backgroundColor: "white",
  },
  savebtn: {
    width: 100,
    backgroundColor: "#6564AD",
    color: "#6564AD",
    fontSize: 18,
    fontWeight: "bold",
    flexDirection: "row",
    borderRadius: 5,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 3,
    marginBottom: 20,
    marginLeft: 10,
    height: 50,
    marginRight: 15,
    paddingRight: 5,
    marginLeft: 5,
  },
  cancelbtn: {
    width: 100,
    backgroundColor: "#E71E4F",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flexDirection: "row",
    borderRadius: 5,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 3,
    marginBottom: 20,
    marginLeft: 10,
    height: 50,
    marginRight: 15,
    paddingRight: 5,
    marginLeft: 5,
  },
  btntext: {
    color: "white",
    fontSize: 18,
    marginLeft: 5,
  },
  modalButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default PatientGeneralInfo;
