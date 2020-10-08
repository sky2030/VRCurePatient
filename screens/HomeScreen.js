import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  Alert,
} from "react-native";
import Header from "../assets/images/Header.png";
import AsyncStorage from "@react-native-community/async-storage";
import {
  Fontisto,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const HomeScreen = ({ navigation, route }) => {
  const [item, setHdata] = useState({});
  const [hospitalcode, sethospitalcode] = useState("");
  const [hospitalName, sethospitalName] = useState("");
  const [data, Setdata] = useState({});
  const [loading, setLoading] = useState(true);

  const GetProfile = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    //   console.log(userToken)
    fetch(BASE_URL, {
      method: "GET",
      headers: { Authorization: userToken },
    })
      .then((res) => res.json())
      .then((results) => {
        if (results.code == 200) {
          Setdata(results.data);
          setLoading(false);
        } else {
          Alert.alert(Alert_Title, results.message);
        }
      })
      .catch((err) => {
        Alert.alert(Alert_Title, SOMETHING_WENT_WRONG);
      });
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      GetProfile();
      setHdata(route.params.item);
      // sethospitalcode(route.params.item.hospitalcode);
      sethospitalName(route.params.item.hospitalname);
      // setHospital(route.params.item);
    });

    return unsubscribe;
  }, [route.params.item]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.head}>
        <MaterialIcons
          name="navigate-before"
          size={30}
          onPress={() => navigation.goBack()}
          style={styles.back}
        />
        <Text style={styles.titletext}>{hospitalName} </Text>
        <MaterialCommunityIcons
          name="home-plus"
          size={30}
          color="white"
          onPress={() => navigation.navigate("Hospital")}
        />
      </View>
      <View style={styles.header}>
        <ImageBackground
          style={styles.imgBackground}
          source={Header}
        ></ImageBackground>
      </View>
      <View style={{ marginBottom: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.intro}>Welcome, </Text>
          <Text style={styles.PatientName}>{data.patient_name}</Text>
        </View>
        <Text style={styles.intro}>How can we help you? </Text>
      </View>

      <View style={styles.CardRows}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Speciality", { item })}
          style={styles.card}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Fontisto name="doctor" size={30} color="#0b635c" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardtext}>Book Doctor</Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("PrescriptionHistory")}
          style={styles.card}
        >
          <View style={{ flex: 1, alignItems: "flex-end", marginTop: 10 }}>
            <Fontisto name="prescription" size={30} color="#0b635c" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardtext}>Prescriptions</Text>
          </View>
        </TouchableOpacity> */}
      </View>
      <View style={styles.CardRows}>
        <View style={styles.SpecialityCard}>
          <Text style={styles.Sintro}>
            Special Treatment for the Following:
          </Text>
          <Text style={styles.specialities}>
            Arthroscopy & Sports Medicine Centre Bariatric & Advance Laparoscopy
            Surgery Dental & Maxillofacial Surgery Dermatology Emergency & Acute
            Care Medicine
          </Text>
        </View>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("Transaction")}
          style={styles.card}
        >
          <View style={{ flex: 1, alignItems: "flex-end", marginTop: 10 }}>
            <FontAwesome5 name="money-check" size={30} color="#0b635c" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardtext}>Transactions</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Appointment")}
          style={styles.card}
        >
          <View style={{ flex: 1, alignItems: "flex-end", marginTop: 10 }}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={30}
              color="#0b635c"
            />
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.cardtext}>Appointments</Text>
          </View>
        </TouchableOpacity> */}
      </View>
      <TouchableOpacity
        style={styles.footer}
        onPress={() => navigation.navigate("PrivacyPolicy")}
      >
        <Text style={styles.bottomtext}>Privacy Policy | Terms of use</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
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

  titletext: {
    color: "white",
    fontSize: 21,
    fontWeight: "500",
    textAlign: "center",
    width: "80%",
  },

  footer: {
    backgroundColor: "#077464",
    position: "absolute",
    padding: 20,
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    bottom: 1,
  },
  bottomtext: {
    color: "#fff",
    fontSize: 15,
  },

  PatientName: {
    color: "#0b635c",
    fontSize: 25,
    fontWeight: "bold",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    fontStyle: "italic",
    marginTop: 5,
  },
  intro: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "italic",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  Sintro: {
    color: "black",
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "italic",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  cardtext: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  specialities: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 8,
  },
  CardRows: {
    flexDirection: "row",
    alignSelf: "center",
    // justifyContent: "space-evenly",
    alignItems: "center",
    //marginVertical:5,
    width: "95%",
    borderRadius: 30,
    marginBottom: 10,
    // backgroundColor: "#e1e"
  },

  card: {
    flex: 1,
    borderColor: "white",
    elevation: 3,
    backgroundColor: "white",
    shadowOffset: { width: 1, height: 1 },
    marginHorizontal: 10,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 60,
    borderRadius: 15,
    borderWidth: 0.2,
  },
  SpecialityCard: {
    flex: 1,
    borderColor: "white",
    elevation: 3,
    backgroundColor: "white",
    shadowOffset: { width: 1, height: 1 },
    marginHorizontal: 10,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 0.2,
  },

  imgBackground: {
    width: "100%",
    flex: 1,
    shadowOpacity: 0.3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    resizeMode: "cover",
    borderRadius: 30,
  },
  header: {
    width: "100%",
    shadowOpacity: 0.3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    height: "40%",
  },
});
