import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    
    <SafeAreaView style={styles.safeArea}>
      <Loader isLoading={loading} />

 
      <Image 
        source={images.logoSmall} 
        style={styles.smallImage}
        resizeMode="contain"
      />

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View style={styles.container}>
          {}
          <Image 
            source={images.logo}
            style={styles.logo}
            resizeMode="contain"
          />

          
          <Text style={styles.text}>
          Uygulamaya Hoş Geldiniz!
          </Text>

          
          <CustomButton
  title={<Text style={styles.buttonText}>E-posta ile devam et</Text>} 
  handlePress={() => router.push("/sign-in")}
  containerStyles={styles.button}
/>

        </View>
      </ScrollView>

      <StatusBar backgroundColor="#D3F9D8" style="dark" />
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF2", 
  },
  smallImage: {
    width: 50, 
    height: 200, 
    position: "absolute",
    top: 10, 
    left: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  
  buttonText: {

    fontSize: 18, 
    color: "#00008B", 
    fontWeight: "bold",

  },
  logo: {
    width: 300,  
    height: 180,  
    borderRadius: 30,
    borderWidth: 5, 
    borderColor: '#FFFFFF',
    shadowColor: '#000',  
    shadowOffset: { width: 5, height: 10 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8,  
    marginBottom: 21, 
    overflow: 'hidden',
  },
  text: {
    fontSize: 22, 
    color: "#000", 
    backgroundColor: "rgba(255, 255, 255, 0.8)", 
    paddingHorizontal: 25, 
    paddingVertical: 15, 
    borderRadius: 15, 
    marginBottom: 40, 
    textAlign: "center",
    fontWeight: "bold", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
