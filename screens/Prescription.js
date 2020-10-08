import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Title, Caption, Paragraph, Drawer } from "react-native-paper";
import moment from "moment-timezone";

export default function Prescription({ navigation, route }) {
  const [data, setData] = useState([]);
  const [AppointmentDate, setDate] = useState(Date);
  const [Doctor, setDoctor] = useState("");

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

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setDate(route.params.item.day_millis);
      setDoctor(route.params.item.doctor.name);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <MaterialIcons
          name="navigate-before"
          size={30}
          onPress={() => navigation.goBack()}
          style={styles.back}
        />
        <Text style={styles.titletext}>Prescription's</Text>
      </View>

      <ScrollView>
        <View style={styles.presCard}>
          <View style={styles.header}>
            <Text style={styles.Titlehead}>Moolchand Hospital </Text>
            <Text style={styles.headtext1}> Dr. {Doctor} </Text>
            <Text style={styles.headtext1}>Lajpat Nagar, New Delhi </Text>
          </View>

          <View style={styles.Patientinfo}>
            <View style={styles.Namesection}>
              <Text style={styles.Infohead}>Patient Name</Text>
              <Text style={styles.infopatient}>Rahul Solanki </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.Infohead}>Gender</Text>
              <Text style={styles.infopatient}>Male </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.Infohead}>Weight</Text>
              <Text style={styles.infopatient}>70 Kg </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.Infohead}>Height</Text>
              <Text style={styles.infopatient}>170 cm </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.Infohead}>Age</Text>
              <Text style={styles.infopatient}>29 </Text>
            </View>
          </View>
          <View style={styles.presbody}>
            <View style={styles.presbodyLeft}>
              <Title style={styles.lefttext}> Chief Complaints </Title>
              <Text style={styles.PlainText}>Headache</Text>
              <Title style={styles.lefttext}> Lab Findings </Title>
              <Text style={styles.PlainText}>Glocose Low </Text>
              <Title style={styles.lefttext}>Suggested Investigation</Title>
              <Text style={styles.PlainText}>Sugar Level Test </Text>
            </View>
            <View style={styles.presbodyRight}>
              <View style={{ flexDirection: "row" }}>
                <Caption style={styles.PlainText}> (Rx) </Caption>
                <Caption style={styles.PlainText}> Amlodipine </Caption>
              </View>
              <Paragraph style={styles.medicinetext}>Instruction</Paragraph>
            </View>
          </View>
          <View style={styles.Specialbody}>
            <Text style={styles.infotext}>Special Instructions:</Text>
            <Text style={styles.PlainText}>
              Take luke warm water before every Sleep
            </Text>

            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text style={styles.date}>Appointment Date</Text>
              <Text>{moment(AppointmentDate).format("ll")} </Text>
              <Text
                style={{ marginLeft: 20, fontWeight: "bold", paddingTop: 20 }}
              >
                Signature
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.bottomtext}>Privacy Policy | Terms of use</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  back: {
    padding: 10,
    color: "#4E557C",
  },
  head: {
    backgroundColor: "#fff",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  titletext: {
    color: "#4E557C",
    fontSize: 25,
    fontWeight: "bold",
    paddingHorizontal: 70,
    alignItems: "center",
  },

  presCard: {
    flex: 1,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#fff",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  Infohead: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  infopatient: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
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
    fontSize: 15,
    fontWeight: "bold",
  },
  medicinetext: {
    fontSize: 15,
    color: "black",
  },
  PlainText: {
    fontSize: 15,
    color: "black",
  },
  presbodyRight: {
    flex: 2,
    height: "100%",
    padding: 10,
    height: 400,
  },
  infotext: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  Specialbody: {
    borderTopColor: "black",
    borderTopWidth: 2,
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 5,
  },
  footer: {
    backgroundColor: "#58DCFC",
    padding: 20,
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  bottomtext: {
    color: "#fff",
    fontSize: 15,
  },
  headtext: {
    color: "#2E76B6",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    borderColor: "#2E76B6",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  headtext1: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  btntext: {
    color: "white",
    fontSize: 15,
    padding: 10,
  },
  date: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
    marginHorizontal: 5,
  },
  header: {
    backgroundColor: "#192161",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 10,
  },
  Patientinfo: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 10,
    flexDirection: "row",
  },
  section: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Namesection: {
    flex: 2,
    paddingLeft: 10,
  },
  Titlehead: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  HeadCard: {
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#E5F0ED",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },

  title4: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  title6: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 30,
    flexDirection: "column",
  },
  title7: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 35,
    flexDirection: "column",
  },
  title8: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
    flexDirection: "column",
  },

  img: {
    marginBottom: 5,
    padding: 30,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
    width: 90,
    padding: 20,
    marginBottom: 7,
    marginTop: 7,
    width: 90,
    padding: 10,
    width: 250,
    height: 250,
  },
  collapseview: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    width: 300,
    backgroundColor: "#077464",
    padding: 20,
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    flexDirection: "row",
    borderRadius: 5,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    elevation: 3,
    marginBottom: 15,
  },
  addicon: {
    width: 35,
    height: 35,
    marginLeft: 20,
  },
  Addbtn: {
    width: 300,
    backgroundColor: "#E5F0ED",
    padding: 25,
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    flexDirection: "row",
    borderRadius: 5,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    elevation: 3,
    marginBottom: 10,
    marginLeft: 15,
    flexDirection: "row",
  },
  addtext: {
    color: "#4E557C",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalToggle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },
  modalContent: {
    flex: 1,
    alignItems: "center",
  },
});
