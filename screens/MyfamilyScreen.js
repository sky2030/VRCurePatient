import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  StatusBar,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Addfamily from "../assets/images/Addfamily.png";
import AsyncStorage from "@react-native-community/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MyfamilyScreen = ({ navigation, route }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, Setdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setpatientId] = useState("");

  const GetFamily = async () => {
    await setpatientId(route.params.data._id);

    const userToken = await AsyncStorage.getItem("userToken");
    //  console.log(userToken)
    fetch(`${BASE_URL}family?patientId=${route.params.data._id}`, {
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
    //  console.log("New Data is going to show")
    //  console.log(data.mobile)
  };

  useEffect(() => {
    GetFamily();
    const unsubscribe = navigation.addListener("focus", () => {
      setpatientId(route.params.data._id);
    });
    return unsubscribe;
  }, [route.params]);

  const renderList = (item) => {
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.Familycard}
        onPress={() => navigation.navigate("familydetail", { item })}
      >
        <View style={styles.header}>
          <Text style={styles.headtext1}>{item.member_name}</Text>
        </View>
        <View style={styles.familybody}>
          <View style={styles.subcard}>
            <Text style={styles.headtext2}>Relation</Text>
            <Text style={styles.headtext2}>{item.relation} </Text>
          </View>
          <View style={styles.subcard}>
            <Text style={styles.headtext2}>Birthdate</Text>
            <Text style={styles.headtext2}>{item.birthdate} </Text>
          </View>
          {/* <TouchableOpacity
            activeOpacity={0.95}
            style={styles.deletecard}
            onPress={() => DeleteMember(item._id)}
          >
            <AntDesign name="delete" size={24} color="#4E557C" />
          </TouchableOpacity> */}
        </View>
      </TouchableOpacity>
    );
  };
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

        <Text style={styles.headtext}>My Family</Text>
        <MaterialCommunityIcons
          name="home-plus"
          size={30}
          color="white"
          onPress={() => navigation.navigate("Hospital")}
        />
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => {
          return renderList(item);
        }}
        keyExtractor={(item) => item._id}
        onRefresh={() => GetFamily()}
        refreshing={loading}
      />

      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.btn}
        onPress={() => navigation.navigate("AddFamily", { patientId })}
      >
        <Text style={styles.btntext}>Add Family Member's </Text>
        <Image source={Addfamily} style={styles.addicon} />
      </TouchableOpacity>
    </View>
  );
};

export default MyfamilyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  headtext1: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  Familycard: {
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
    marginBottom: 20,
    marginVertical: 10,
  },
  header: {
    backgroundColor: "#192161",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  headtext2: {
    color: "#4E557C",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  familybody: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 10,
  },
  subcard: {
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "column",
  },
  deletecard: {
    width: "10%",
  },
  title6: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 30,
    flexDirection: "column",
  },

  btntext: {
    color: "#4E557C",
    fontSize: 20,
    fontWeight: "bold",
  },
  addicon: {
    width: 35,
    height: 35,
    marginLeft: 20,
  },
  btn: {
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
    marginBottom: 35,
    marginLeft: 25,
    flexDirection: "row",
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
  },
});
