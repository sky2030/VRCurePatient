import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-community/async-storage";
import { Title, Caption, Paragraph, Drawer } from "react-native-paper";
import moment from "moment-timezone";
const screenWidth = Math.round(Dimensions.get("window").width);
import PageControl from "react-native-page-control";
const NA = "N/A";
export default function PatientHistory({ navigation, route }) {
  let key_prefix = "";
  const [data, setData] = useState([]);
  const [currentPage, setcurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async (appointment_id) => {
    const userToken = await AsyncStorage.getItem("userToken");
    let URL = `${BASE_URL}prescription`;
    if (appointment_id) {
      URL = `${URL}?a_id=${appointment_id}`;
    }
    console.log(URL);
    fetch(URL, {
      method: "GET",
      headers: { Authorization: userToken },
      cache: "default",
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(JSON.stringify(results));
        setLoading(false);
        if (results.code == 200) {
          setData(results.data);
        } else {
          Alert.alert(results.message);
        }
      })
      .catch((err) => {
        setLoading(false);

        Alert.alert(SOMETHING_WENT_WRONG);
      });
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      console.log("Use effect Prescription history :", route.params);

      // setData(["kkk", "hjdhbhd", "wghwugwug"]);
      let appointment_id = undefined;
      key_prefix = "";
      if (route.params && route.params.appointment_id) {
        appointment_id = route.params.appointment_id;
        key_prefix = appointment_id;
      }
      setData([]);
      setLoading(true);
      fetchData(appointment_id);
    });
    return unsubscribe;
  }, [route.params]);

  const renderItem = (item, index) => {
    console.log("renderItem :", item.appointment_id);
    const advice = item.information.advice;
    const special_advice = item.information.suggested_investigation;
    const symptoms = item.information.symptoms;
    const findings = item.information.lab_findings;
    const fileString = item.information.file_path;
    const patientName = item.patient.name ? item.patient.name : NA;
    const patientWeight = item.patient.weight ? item.patient.weight : NA;
    const patientAge = item.patient.age ? item.patient.age : NA;
    const patientHeight = item.patient.height ? item.patient.height : NA;
    const patientGender = item.patient.gender ? item.patient.gender : NA;
    const suggestedInvestigation = "";
    const appointmentDate = moment(item.created_date).format("ll");
    const Hospital_Name = item.hospital.name;
    return (
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={styles.presCard}>
          <View style={styles.header}>
            <Text style={styles.Titlehead}>{Hospital_Name}</Text>
            <Text style={styles.headtext}> {item.doctor.name} </Text>
            <Text style={styles.headtext}>
              {item.hospital.place} , {item.hospital.city}{" "}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginTop: 10,
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Text style={{ color: "black", fontWeight: "900", fontSize: 18 }}>
              Patient Name :{" " + patientName}
            </Text>
          </View>
          <View style={styles.Patientinfo}>
            <View>
              <View
                style={{
                  marginLeft: 10,
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "900",
                    fontSize: 16,
                    width: 70,
                  }}
                >
                  Gender
                </Text>
                <Text
                  style={{ color: "black", fontWeight: "900", fontSize: 16 }}
                >
                  :{" " + patientGender}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 10,
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "900",
                    fontSize: 16,
                    width: 70,
                  }}
                >
                  Age
                </Text>
                <Text
                  style={{ color: "black", fontWeight: "900", fontSize: 16 }}
                >
                  :{" " + patientAge}
                </Text>
              </View>
            </View>
            <View style={{ marginLeft: 10 }}>
              <View
                style={{
                  marginLeft: 20,
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "900",
                    fontSize: 16,
                    width: 70,
                  }}
                >
                  Weight
                </Text>
                <Text
                  style={{ color: "black", fontWeight: "900", fontSize: 16 }}
                >
                  :{" " + patientWeight}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: 20,
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "900",
                    fontSize: 16,
                    width: 70,
                  }}
                >
                  Height
                </Text>
                <Text
                  style={{ color: "black", fontWeight: "900", fontSize: 16 }}
                >
                  :{" " + patientHeight}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.presbody}>
            <View style={styles.presbodyLeft}>
              <Title style={styles.lefttext}> Chief Complaints </Title>
              <Text style={styles.infotext}>{symptoms}</Text>

              <Title style={styles.lefttext}> Lab Findings </Title>
              <Text style={styles.infotext}>{findings}</Text>

              <Title style={styles.lefttext}> Suggested Investigation </Title>
              <Text style={styles.infotext}>{suggestedInvestigation}</Text>
            </View>
            <View style={styles.presbodyRight}>
              <Text style={styles.infotext}>{advice}</Text>
            </View>
          </View>
          <View style={styles.Specialbody}>
            <Text style={styles.infotext}>Special Instructions:</Text>
            <Text style={styles.infotext}>{special_advice}</Text>

            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text style={styles.date}>Appointment Date</Text>
              <Text>{appointmentDate}</Text>
              <Text style={{ marginLeft: 20, fontWeight: "900" }}>
                Signature
              </Text>
            </View>
          </View>
        </View>
        {fileString.length > 0 && (
          <View>
            <Image
              source={{ uri: fileString }}
              style={{ flex: 1, aspectRatio: 0.4, marginBottom: 10 }}
            />
          </View>
        )}
      </ScrollView>
    );
  };
  const onScrollEnd = (e) => {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    // console.log('scrolled to page ', pageNum);
    setcurrentPage(pageNum);
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <MaterialIcons
          name="navigate-before"
          size={30}
          onPress={() => navigation.goBack()}
          style={styles.back}
        />
        <Text style={styles.titletext}>Prescription</Text>
        <MaterialCommunityIcons
          name="home-plus"
          size={30}
          color="white"
          onPress={() => navigation.navigate("Hospital")}
        />
      </View>

      {
        <FlatList
          horizontal
          pagingEnabled
          data={data}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item, index) => `${key_prefix}${item.appointment_id}`}
          onMomentumScrollEnd={onScrollEnd}
          onRefresh={() => {}}
          refreshing={loading}
        />
      }
      {data.length > 0 && (
        <PageControl
          style={{ position: "absolute", left: 0, right: 0, bottom: 50 }}
          numberOfPages={data.length}
          currentPage={currentPage}
          hidesForSinglePage
          pageIndicatorTintColor="gray"
          currentPageIndicatorTintColor="#009387"
          indicatorStyle={{ borderRadius: 5 }}
          currentIndicatorStyle={{ borderRadius: 5 }}
          indicatorSize={{ width: 8, height: 8 }}
          // onPageIndicatorPress={this.onItemTap}
        />
      )}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => navigation.navigate("PrivacyPolicy")}
        style={styles.footer}
      >
        <Text style={styles.bottomtext}>Privacy Policy | Terms of use</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 10,
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

  presCard: {
    // flex: 1,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#fff",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#1e1",
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 70,
    width: screenWidth - 20,
  },
  presbody: {
    flex: 1,
    flexDirection: "row",
    borderTopColor: "black",
    borderTopWidth: 2,
  },
  presbodyLeft: {
    flex: 1,
    height: "100%",
    padding: 10,
    borderRightColor: "black",
    borderRightWidth: 2,
  },
  lefttext: {
    fontSize: 13,
    fontWeight: "900",
  },
  presbodyRight: {
    flex: 2,
    height: "100%",

    padding: 10,
    height: 400,
  },
  textInput: {
    flex: 1,
    color: "#05375a",
    padding: 10,
  },
  infoInput: {
    color: "#05375a",
    padding: 10,
  },
  infoInput: {
    color: "#05375a",
    padding: 10,
  },
  specialInput: {
    flex: 1,
    color: "#05375a",
    padding: 10,
    width: "100%",
    height: 50,
  },
  date: {
    color: "#000",
    fontSize: 14,
    fontWeight: "900",
    marginHorizontal: 5,
  },

  footer: {
    backgroundColor: "#009387",
    padding: 20,
    height: 40,
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomtext: {
    color: "#fff",
    fontSize: 15,
  },

  Titlehead: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
  },
  headtext: {
    color: "white",
    fontSize: 15,
    fontWeight: "900",
  },

  header: {
    backgroundColor: "#192161",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 10,
  },

  Patientinfo: {
    flexDirection: "row",
    width: "100%",
  },
  section: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  Specialbody: {
    borderTopColor: "black",
    borderTopWidth: 2,
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 5,
  },
  infotext: {
    color: "black",
    // fontSize: 16,
    fontWeight: "900",
    paddingVertical: 5,
  },
  whitebold: {
    color: "white",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    fontWeight: "500",
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: "#009387",
  },
  redbold: {
    color: "white",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    fontWeight: "500",
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: "red",
  },
  btn: {
    backgroundColor: "#192161",
    padding: 5,
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    flexDirection: "row",
    borderRadius: 5,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    elevation: 3,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 3,
    paddingHorizontal: 5,
    color: "black",
    fontWeight: "900",
    // width: 90,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    fontSize: 16,
    fontWeight: "900",
    paddingVertical: 3,
    color: "black",
    backgroundColor: "#fff",
    // width: 70,
  },
});

const ageItem = () => {
  let list = [
    {
      label: NA,
      value: NA,
    },
  ];
  let index = 1;
  while (index <= 125) {
    list.push({
      label: `${index}`,
      value: `${index}`,
    });
    index++;
  }
  return list;
};
const weightItem = () => {
  let list = [
    {
      label: NA,
      value: NA,
    },
  ];
  let index = 1;
  while (index <= 200) {
    list.push({
      label: `${index}  Kg`,
      value: `${index}  Kg`,
    });
    index++;
  }
  return list;
};
const heightItem = () => {
  let list = [
    {
      label: NA,
      value: NA,
    },
  ];
  let index = 30;
  while (index <= 225) {
    list.push({
      label: `${index}  cm`,
      value: `${index}  cm`,
    });
    index++;
  }
  return list;
};
const genderItem = [
  {
    label: "Male",
    value: "Male",
  },
  {
    label: "Female",
    value: "Female",
  },
  {
    label: "Other",
    value: "Other",
  },
];
const retnum = (str) => {
  var num = str.replace(/[^0-9]/g, "");
  return parseInt(num, 10);
};
