import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "./components/context";
import "./Global";
import RootStackScreen from "./screens/RootStackScreen";
import DrawerStackScreen from "./screens/DrawerNav";

export default function App({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          userName: action.id,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  const authContext = React.useMemo(
    () => ({
      signIn: (username, password) => {
        setIsLoading(false);
        fetch(`${BASE_URL}login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: username,
            password: password,
          }),
        })
          .then((res) => res.json())
          .then(async (data) => {
            try {
              await AsyncStorage.setItem("userToken", data.data.token);
              const userToken = await AsyncStorage.getItem("userToken");
              dispatch({ type: "LOGIN", id: username, token: userToken });
            } catch (e) {
              console.log("Something went wrong with sky's Code", e);
              Alert.alert(Alert_Title, SOMETHING_WENT_WRONG);
            }
          });
        //  const userToken = AsyncStorage.getItem('userToken');
        // dispatch({ type: 'LOGIN', id: username, token: userToken });
      },
      signOut: async () => {
        setUserToken(null);
        setIsLoading(false);
        try {
          await AsyncStorage.removeItem("userToken");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },
      signUp: (username, password, email, confirm_password) => {
        // setIsLoading(false);
        fetch(`${BASE_URL}signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: username,
            password,
            email,
            confirm_password,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            try {
              console.log(`${data} Added Successfully`);
              Alert.alert(Alert_Title, data.message);
              if (data.code >= 200 && data.code <= 399) {
                navigation.navigate("SignInScreen");
              }
            } catch (e) {
              console.log("Something went wrong with sky's code", e);
              Alert.alert(Alert_Title, SOMETHING_WENT_WRONG);
            }
          })
          .catch((e) => {
            console.log("Error in Fetching", e);
            Alert.alert(Alert_Title, SOMETHING_WENT_WRONG);
          });
        dispatch({ type: "REGISTER", id: username });
      },
    }),
    []
  );

  const CheckToken = () => {
    setTimeout(async () => {
      setIsLoading(false);
      let checkToken;
      checkToken = null;
      try {
        checkToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.log(e);
      }

      dispatch({ type: "RETRIEVE_TOKEN", token: checkToken });
    }, 1000);
  };

  useEffect(() => {
    CheckToken();
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken !== null ? (
          <DrawerStackScreen />
        ) : (
          <RootStackScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
