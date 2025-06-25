import * as AuthSession from "expo-auth-session";
import { Button, StyleSheet, Text, View } from "react-native";
import { Auth0Provider, useAuth0 } from "react-native-auth0";

function Home() {
  const { authorize, user } = useAuth0();
  const customScheme = "com.numanappdev.SocialLogin";
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  console.log("redirectUri------------>>>>>>", redirectUri);

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
      <Button onPress={onLogin} title={"Log In"} />
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
    </Auth0Provider> // 👈 new code
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
});
