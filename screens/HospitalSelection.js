import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

const HospitalSelection = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    // console.log(userToken)
    await fetch(`${BASE_URL}hospitals`, {
      method: "GET",
      headers: { Authorization: userToken },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(JSON.stringify(results));
        if (results.code == 200) {
          setData(results.data);
        } else {
          Alert.alert(Alert_Title, results.message);
        }

        setLoading(false);
      })
      .catch((err) => {
        Alert.alert(Alert_Title, SOMETHING_WENT_WRONG);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, []);

  const renderList = (item) => {
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.HospitalCard}
        onPress={() => navigation.navigate("HospitalHome", { item })}
      >
        <View style={styles.drImage}>
          <Image style={styles.img} source={{ uri: item.picture }} />
        </View>
        <View style={styles.detail}>
          <Text style={styles.headtextNew}>{item.hospitalname} </Text>
          <Text style={styles.headtext2}>{item.place} </Text>
          <Text style={styles.headtext2}>
            {item.city}, {item.state}
          </Text>
          {/* <Text style={styles.headtext2}> {item.hospitalcode}</Text> */}
          <View style={styles.btnnew}></View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <FlatList
        style={{ marginTop: 10 }}
        data={data}
        renderItem={({ item }) => {
          return renderList(item);
        }}
        keyExtractor={(item) => item._id}
        onRefresh={() => fetchData()}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: 40,
    width: "100%",
  },
  head: {
    backgroundColor: "#58DCFC",
    padding: 20,
    height: 60,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    backgroundColor: "#493187",
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
  header: {
    color: "black",
    marginBottom: 10,
    fontSize: 25,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  headtext: {
    color: "#fff",
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "bold",
  },

  btnnew: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 80,
    marginTop: 10,
  },

  headtextNew: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginTop: 10,
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    // marginLeft: 20,
  },

  HospitalCard: {
    flexDirection: "row",
    borderRadius: 15,
    elevation: 3,
    backgroundColor: "white",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    // alignItems: "center",
    // justifyContent: "center",
    marginVertical: 5,
    marginHorizontal: 10,
  },
  headerNew: {
    backgroundColor: "#07a9b8",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderTopLeftRadius: 20,
  },
  headerNew1: {
    backgroundColor: "#3385ff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 35,
    padding: 5,
    elevation: 2,
    borderRadius: 4,
  },
  headtext3: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    width: "100%",
    marginBottom: 5,
  },
  headtext2: {
    color: "#4E557C",
    fontSize: 16,
    marginTop: 5,
    flex: 1,
    // marginLeft: 30,
  },
  cardbody: {
    // alignItems: "center",
    // justifyContent: "center",
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#1e1",
  },

  drImage: {
    paddingLeft: 13,
    paddingVertical: 13,
    flex: 0.6,
    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "#1e1"
  },
  detail: {
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
    //marginLeft:10,
    // backgroundColor: "#1e1"
  },
  headtextTop: {
    fontSize: 30,
    fontWeight: "bold",
    paddingHorizontal: 70,
    color: "#fff",
  },
  headTop: {
    backgroundColor: "#07a9b8",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },
  img: {
    aspectRatio: 1,
    borderRadius: 5,
    flex: 1,
    // marginLeft: 10, marginVertical: 10
    // width: 120,
    // height: 120,
    // marginTop: 7,
    // //borderBottomEndRadius:30,
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
    // //borderTopEndRadius:30,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
  },
});

export default HospitalSelection;
