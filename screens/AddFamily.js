import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Button,
  TextInput,
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment-timezone";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

export default function AddFamily({ navigation, route }) {
  const [patientId, setpatientId] = useState("");
  const [member_name, SetMemberName] = useState("");
  const [relation, setrelation] = useState("");
  const [birthdate, setbirthdate] = useState("");
  const [phone, setphone] = useState("");
  const [isDatePickerAvailable, setDatePickerAvailable] = useState(false);

  const handleDatePicker = (date) => {
    setbirthdate(moment(date).format("DD/MM/YYYY"));
    //updateDOB(date);
    setDatePickerAvailable(false);
  };
  const submitData = async () => {
    // await setpatientId(route.params.patientId);
    const userToken = await AsyncStorage.getItem("userToken");
    fetch(`${BASE_URL}familys/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken,
      },
      body: JSON.stringify({
        member_name,
        patientId,
        relation,
        birthdate,
        phone,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(`${member_name} is saved successfully`);
      })
      .catch((err) => {
        Alert.alert(Alert_Title, SOMETHING_WENT_WRONG);
      });

    setTimeout(() => {
      SetMemberName("");
      setrelation("");
      setbirthdate("");
      setphone("");
    }, 2000);
    navigation.navigate("Myfamily");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setpatientId(route.params.patientId);
      SetMemberName(route.params.member_name);
      setrelation(route.params.relation);
      setbirthdate(route.params.birthdate);
      setphone(route.params.phone);

      // console.log(route.params)
    });

    return unsubscribe;
  }, [route.params]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.head}>
          <MaterialIcons
            name="navigate-before"
            size={30}
            onPress={() => navigation.goBack()}
            style={styles.back}
          />

          <Text style={styles.headtext}>Add Family Member</Text>
          <MaterialCommunityIcons
            name="home-plus"
            size={30}
            color="white"
            onPress={() => navigation.navigate("Hospital")}
          />
        </View>

        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={member_name}
            mode="outlined"
            onChangeText={(text) => SetMemberName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Relation"
            value={relation}
            mode="outlined"
            onChangeText={(text) => setrelation(text)}
          />

          <View style={styles.Subtitle}>
            <TextInput
              style={styles.input}
              placeholder="Birthdate of Family Member"
              value={birthdate}
              mode="outlined"
              onChangeText={(text) => setbirthdate(text)}
            />
            <TouchableOpacity
              style={{
                color: "#08211c",
                marginLeft: 10,
                marginTop: 15,
                flex: 1,
              }}
              onPress={() => setDatePickerAvailable(true)}
            >
              <AntDesign name="calendar" size={45} color="black" />
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerAvailable}
            mode="date"
            onConfirm={handleDatePicker}
            onCancel={() => setDatePickerAvailable(false)}
          />

          <TextInput
            style={styles.input}
            placeholder="Family phone no"
            value={phone}
            mode="outlined"
            onChangeText={(text) => setphone(text)}
          />
          <View style={{ marginVertical: 10 }}>
            <Button
              color="maroon"
              title="Submit"
              onPress={() => submitData()}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
  },
  header: {
    width: "100%",
    backgroundColor: "#E5F0ED",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  btntext: {
    color: "#4E557C",
    fontSize: 20,
    fontWeight: "bold",
  },
  Subtitle: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginHorizontal: 2,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderBottomColor: "black",
    padding: 10,
    fontSize: 18,
    marginHorizontal: 10,
    marginTop: 20,
  },
  head: {
    backgroundColor: "#21ada2",
    flexDirection: "row",
    height: 50,
    width: "100%",
    alignItems: "center",
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
  inputlast: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    height: 38,
    marginHorizontal: 10,
    marginVertical: 10,
    borderBottomColor: "black",
  },
});

export const images = {
  ratings: {
    1: require("../assets/rating-1.png"),
    2: require("../assets/rating-2.png"),
    3: require("../assets/rating-3.png"),
    4: require("../assets/rating-4.png"),
    5: require("../assets/rating-5.png"),
  },
};
