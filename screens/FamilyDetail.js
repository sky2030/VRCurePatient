import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  Platform,
  Alert,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Title, Card, Button } from "react-native-paper";
import {
  MaterialIcons,
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment-timezone";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const FamilyDetail = ({ navigation, route }) => {
  // const { member_name, _id, relation, birthdate, phone } = route.params.item;

  const [member_name, SetMemberName] = useState(route.params.item.member_name);
  const [relation, setrelation] = useState(route.params.item.relation);
  const [birthdate, setbirthdate] = useState(route.params.item.birthdate);
  const [phone, setphone] = useState(route.params.item.phone);
  const [isDatePickerAvailable, setDatePickerAvailable] = useState(false);

  const handleDatePicker = (date) => {
    setbirthdate(moment(date).format("DD/MM/YYYY"));
    //updateDOB(date);
    setDatePickerAvailable(false);
  };
  const submitData = async () => {
    // await setpatientId(route.params.patientId);
    const userToken = await AsyncStorage.getItem("userToken");
    fetch(`${BASE_URL}familys/${route.params.item._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken,
      },
      body: JSON.stringify({
        member_name,
        relation,
        birthdate,
        phone,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(`${member_name} is Update successfully`);
      })
      .catch((err) => {
        Alert.alert(Alert_Title, SOMETHING_WENT_WRONG);
      });
    navigation.navigate("Profile");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      SetMemberName(route.params.item.member_name);
      setrelation(route.params.item.relation);
      setbirthdate(route.params.item.birthdate);
      setphone(route.params.item.phone);

      // console.log(route.params)
    });

    return unsubscribe;
  }, [route.params]);

  const DeleteMember = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    fetch(`${BASE_URL}familys/${route.params.item._id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          Alert.alert(`${member_name} deleted`);
          navigation.navigate("Myfamily");
        }
        Alert.alert(Alert_Title, data.message);
      })
      .catch((err) => {
        Alert.alert(Alert_Title, SOMETHING_WENT_WRONG);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.root}>
        <View style={styles.headTop}>
          <MaterialIcons
            name="navigate-before"
            size={35}
            onPress={() => navigation.goBack()}
            style={styles.back}
          />
          <Text style={styles.titletext}>Family Member Detail</Text>
          <MaterialCommunityIcons
            name="home-plus"
            size={30}
            color="white"
            onPress={() => navigation.navigate("Hospital")}
          />
        </View>

        {/* <View style={{ alignItems: "center", margin: 15 }}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>{member_name}</Text>
        <Text style={{ fontSize: 22 }}>{relation}</Text>
      </View> */}

        <Card style={styles.mycard}>
          <View style={styles.cardContent}>
            <MaterialIcons name="person" size={32} color="#06bf91" />

            <Text style={styles.mytext}>{member_name}</Text>
          </View>
        </Card>
        <Card style={styles.mycard}>
          <View style={styles.cardContent}>
            <MaterialIcons name="speaker-group" size={32} color="#06bf91" />

            <Text style={styles.mytext}>{relation}</Text>
          </View>
        </Card>
        <Card style={styles.mycard}>
          <View style={styles.cardContent}>
            <FontAwesome name="birthday-cake" size={32} color="#06bf91" />

            <Text style={styles.mytext}>{birthdate}</Text>
          </View>
        </Card>
        <Card style={styles.mycard} onPress={() => openDial()}>
          <View style={styles.cardContent}>
            <MaterialIcons name="dialer-sip" size={32} color="#06bf91" />

            <Text style={styles.mytext}>{phone}</Text>
          </View>
        </Card>
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
          {/* <TextInput
            style={styles.inputlast}
            placeholder="Birthdate of Family Member"
            value={birthdate}
            mode="outlined"
            onChangeText={(text) => setbirthdate(text)}
          /> */}

          <TextInput
            style={styles.inputlast}
            placeholder="Family phone no"
            value={phone}
            mode="outlined"
            onChangeText={(text) => setphone(text)}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10,
          }}
        >
          <Button
            icon="account-edit"
            mode="contained"
            theme={theme}
            onPress={() => submitData()}
          >
            Edit
          </Button>
          <Button
            icon="delete"
            mode="contained"
            theme={theme}
            onPress={() => DeleteMember()}
          >
            Delete Member
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const theme = {
  colors: {
    primary: "#006aff",
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headTop: {
    width: "100%",
    flexDirection: "row",
    height: 45,
    alignItems: "center",
  },

  titletext: {
    color: "#4E557C",
    fontSize: 25,
    fontWeight: "bold",
    paddingHorizontal: 80,
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
    borderRadius: 6,
    marginTop: 20,
  },
  inputlast: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginVertical: 20,
    borderBottomColor: "black",
  },
  mycard: {
    marginTop: 10,
    marginHorizontal: 2,
  },
  cardContent: {
    flexDirection: "row",
    padding: 10,
  },
  mytext: {
    fontSize: 22,
    marginTop: 3,
    marginLeft: 5,
  },
});
export default FamilyDetail;
