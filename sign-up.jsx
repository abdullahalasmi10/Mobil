import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, TextInput, StyleSheet } from "react-native";
import { images } from "../../constants";
import { createUser } from "../../lib/appwrite";
import { CustomButton } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image source={images.cards} resizeMode="contain" style={styles.logo} />

          <Text style={styles.title}>Hastane de Kaydolun</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              value={form.username}
              onChangeText={(text) => setForm({ ...form, username: text })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              style={styles.textInput}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              style={styles.textInput}
              secureTextEntry
            />
          </View>

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Have an account already?</Text>
            <Link href="/sign-in" style={styles.loginLink}>
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FC", 
  },
  scrollContainer: {
    minHeight: Dimensions.get("window").height - 100,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 280,  // 
    height: 200,  //
    borderRadius: 30,  // 
    borderWidth: 5,  // 
    borderColor: '#FFFFFF',  // 
    shadowColor: '#000',  //
    shadowOffset: { width: 5, height: 10 },  //
    shadowOpacity: 0.2,  // 
    shadowRadius: 8,  // 
    marginBottom: 20,  // 
  },
  title: {
    fontSize: 26,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 40,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: "#333",
  },
  loginLink: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  inputContainer: {
    width: "80%",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
        marginBottom: 5,
  },
  textInput: {
    fontSize: 18, 
    fontWeight: "600", 
    letterSpacing: 0.5, //
    lineHeight: 24, // 
    padding: 12,
    borderWidth: 1,
    borderColor: "#B0BEC5", //
    borderRadius: 8,
    backgroundColor: "#FFF",
    color: "#333", //  
  },
});
