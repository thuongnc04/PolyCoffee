import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";

import logo from "../../assets/logo.png";
import apiUrl from "../../apiUrl";
import { useTranslation } from 'react-i18next';
import { ThemeContext } from "../theme/ThemeContext";


const Register = ({ navigation }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t } = useTranslation('register');

  const registerUser = (userData) => {
    fetch("http://" + apiUrl.thuong + ":3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("User registered successfully:", data);
        console.log("Registration successful");
        navigation.navigate("main", { nameUserSend: fullname });
      })
      .catch((error) => {
        console.error("Error registering user:", error);
      });
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = (email) => emailPattern.test(email);

  const phonePattern = /^[0-9]{10}$/;
  const isValidPhone = (phone) => phonePattern.test(phone);

  const handleRegister = () => {
    if (
      fullname.trim() === "" ||
      username.trim() === "" ||
      password.trim() === "" ||
      email.trim() === "" ||
      phone.trim() === "" ||
      address.trim() === ""
    ) {
      setErrorMessage(t('register.fillAllFieldsError'));
    } else if (!isValidEmail(email)) {
      setErrorMessage(t('register.invalidEmailError'));
    } else if (!isValidPhone(phone)) {
      setErrorMessage(t('register.invalidPhoneError'));
    } else {
      const userData = {
        username,
        password,
        name: fullname,
        email,
        phone,
        address,
      };
      registerUser(userData);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Image style={styles.logo} source={logo} />
          <Text style={styles.title}>
            {t('register.createAccount')}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder={t('register.fullnamePlaceholder')}
              placeholderTextColor={theme.colors.text}
              style={styles.input}
              onChangeText={(text) => setFullname(text)}
              value={fullname}
            />
            <TextInput
              placeholder={t('register.emailPlaceholder')}
              placeholderTextColor={theme.colors.text}
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              value={email}
              keyboardType="email-address"
            />
            <TextInput
              placeholder={t('register.usernamePlaceholder')}
              placeholderTextColor={theme.colors.text}
              style={styles.input}
              onChangeText={(text) => setUsername(text)}
              value={username}
            />
            <TextInput
              placeholder={t('register.passwordPlaceholder')}
              placeholderTextColor={theme.colors.text}
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry
            />
            <TextInput
              placeholder={t('register.phonePlaceholder')}
              placeholderTextColor={theme.colors.text}
              style={styles.input}
              onChangeText={(text) => setPhone(text)}
              value={phone}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder={t('register.addressPlaceholder')}
              placeholderTextColor={theme.colors.text}
              style={styles.input}
              onChangeText={(text) => setAddress(text)}
              value={address}
            />
          </View>

          {errorMessage !== "" && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>{t('register.loginNow')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInLink}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{color: theme.colors.text}}>{t('register.alreadyHaveAccount')} </Text>
            <Text style={styles.linkText}>{t('register.loginNow')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    innerContainer: {
      alignItems: "center",
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    title: {
      fontSize: 25,
      fontWeight: "bold",
      marginBottom: 30,
      color: theme.colors.text,
    },
    inputContainer: {
      width: "80%",
      marginBottom: 20,
    },
    input: {
      height: 40,
      width: 350,
      borderRadius: 10,
      borderColor: theme.colors.border,
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 10,
      marginTop: 10,
      backgroundColor: theme.colors.inputBackground,
      color: theme.colors.text,
    },
    errorText: {
      color: "red",
      marginBottom: 10,
    },
    registerButton: {
      backgroundColor: theme.colors.cart,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    signInLink: {
      flexDirection: "row",
      marginTop: 60,
    },
    linkText: {
      color: "#35C2C1",
    },
  });

export default Register;
