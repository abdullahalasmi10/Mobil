import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, TextInput, StyleSheet } from "react-native";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
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
          <Image
            source={images.cards}
            resizeMode="contain"
            style={styles.logo}
          />

          <Text style={styles.title}>Hastane de giriş yapın</Text>

          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              value={form.email}
              onChangeText={(e) => setForm({ ...form, email: e })}
              style={styles.textInput}
              keyboardType="email-address"
            />
          </View>

          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              value={form.password}
              onChangeText={(e) => setForm({ ...form, password: e })}
              style={styles.textInput}
              secureTextEntry
            />
          </View>

          <CustomButton  
            title="Sign In"
            handlePress={submit}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}> Hesabınız yok mu? </Text>
            <Link
              href="/sign-up"
              style={styles.signupLink}
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },
  scrollContainer: {
    minHeight: Dimensions.get("window").height - 100,
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 280, 
    height: 200,
    borderRadius: 30,
    borderWidth: 5,  
    borderColor: '#FFFFFF',
    shadowColor: '#000',  
    shadowOffset: { width: 5, height: 10 },  
    shadowOpacity: 0.2,
    shadowRadius: 8, 
    marginBottom: 20, 
    overflow: 'hidden', 
  },
  title: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 40,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007BFF", // اللون الأزرق
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 15,
  },
  signupText: {
    fontSize: 16,
    color: "#333",
  },
  signupLink: {
    fontSize: 16,
    color: "#007BFF", // اللون الأزرق
    fontWeight: "bold",
  },

  // تخصيص استايلات الحقول النصية
  inputContainer: {
    width: "80%",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600", // تعريض الخط
    marginBottom: 5,
  },
  textInput: {
    fontSize: 18, // تعريض الخط وزيادة حجمه
    fontWeight: "600", // تعريض الخط
    padding: 12,
    borderWidth: 1,
    borderColor: "#B0BEC5", // لون الحدود
    borderRadius: 8,
    backgroundColor: "#FFF", // خلفية الحقل
    color: "#333", // لون النص داخل الحقل
  },
});
