import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function SupportScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <MaterialIcons
          name="navigate-before"
          size={28}
          onPress={() => navigation.goBack()}
          style={styles.back}
        />
        <Text style={styles.titletext}>Contact us </Text>
        <MaterialCommunityIcons
          name="home-plus"
          size={30}
          color="white"
          onPress={() => navigation.navigate("Hospital")}
        />
      </View>

      <ScrollView>
        <View style={styles.contactCard}>
          <View style={styles.header}>
            <Text style={styles.headtext1}> Emergency Helpline</Text>
          </View>
          <View style={styles.title4}>
            <View style={styles.title7}>
              <Text style={styles.headtext2}>Landline Number</Text>
              <Text style={styles.headtext2}>+120-3534444</Text>
            </View>
            <View style={styles.title8}>
              <Text style={styles.headtext2}>Email Address</Text>
              <Text style={styles.headtext2}>
                Emergency@apollohospital.com{" "}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.contactCard}>
          <View style={styles.header}>
            <Text style={styles.headtext1}> Application Support</Text>
          </View>
          <View style={styles.title4}>
            <View style={styles.title7}>
              <Text style={styles.headtext2}>Whatsup Number</Text>
              <Text style={styles.headtext2}>+91-9898989900</Text>
            </View>
            <View style={styles.title8}>
              <Text style={styles.headtext2}>Email Address</Text>
              <Text style={styles.headtext2}>eopd@smhs.motherson.com </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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

  headtext2: {
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
    fontSize: 15,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  contactCard: {
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
  },

  title4: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingBottom: 10,
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
});
