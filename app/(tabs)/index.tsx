import * as AuthSession from "expo-auth-session";

import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import React, { useState } from "react";
import { Auth0Provider, useAuth0 } from "react-native-auth0";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    "75169266700-iel4aupplj6c68p2kgu2hemeje8k2bjr.apps.googleusercontent.com",
  iosClientId:
    "75169266700-02tiavoeq0b3i8dveic3drr3ccd87jks.apps.googleusercontent.com",
});
function Home() {
  const { authorize, user } = useAuth0();
  const customScheme = "com.numanappdev.SocialLogin";
  const redirectUri = AuthSession.makeRedirectUri();
  const [userData, setUserData] = useState<User | null>(null);
  console.log("redirectUri------------>>>>>>", redirectUri);
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("User Info:", userInfo);
      setUserData(userInfo.data);
    } catch (error: any) {
      console.error("Sign-In Error:", error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            Alert.alert("Cancelled", "User cancelled the login.");
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert("In Progress", "Sign in is already in progress.");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Error", "Play Services not available or outdated.");
            break;
          default:
            Alert.alert("Error", "An unknown error occurred.");
        }
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };
  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
      setUserData(null);
      Alert.alert("Logged Out", "You have been signed out.");
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const onLogin = async () => {
    console.log("authorize------------>>>>>>", authorize);

    try {
      await authorize(
        {
          scope: "openid profile email",
        },
        {
          customScheme: customScheme,
        }
      );
    } catch (e) {
      throw Error(
        "There was an issue authenticating the user. Please try again."
      );
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}> Auth0 React Native - Login </Text>
      <Button onPress={onLogin} title={"Log In with Auth0"} />
      <GoogleSigninButton onPress={handleGoogleSignIn} />
      {userData && (
        <TouchableOpacity
          style={[styles.secondaryButton, { marginTop: 10 }]}
          onPress={handleLogout}
        >
          <Text style={styles.secondaryButtonText}>Logout from Google</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function App() {
  return (
    <Auth0Provider
      domain={"dev-srxaw3tjprbhnkdc.au.auth0.com"}
      clientId={"VQ30HR0Mb2nTET1hh07o7wCxReJT0h2H"}
    >
      <Home />
    </Auth0Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  secondaryButton: {
    backgroundColor: "#FFF",
    paddingVertical: 14,
    paddingHorizontal: 24,

    borderRadius: 8,
    borderColor: "#4285F4",
    borderWidth: 2,
    width: "50%",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4285F4",
    fontWeight: "bold",
    fontSize: 16,
  },
});
