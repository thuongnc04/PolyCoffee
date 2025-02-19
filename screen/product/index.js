import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { ThemeContext } from "../theme/ThemeContext"; // Import ThemeContext
import apiUrl from "../../apiUrl";
import { useTranslation } from 'react-i18next'

const Product = ({ navigation }) => {
  const { theme } = useContext(ThemeContext); // Use theme from ThemeContext
  const route = useRoute();
  const { data, namePro, withwhere, money, favorite, id, category } =
    route.params || {};
  const [selectedSize, setSelectedSize] = useState("small");
  const [isFavorite, setIsFavorite] = useState();
  const url_api = "http://" + apiUrl.thuong + ":3000/carts";
  const url_apiPro = "http://" + apiUrl.thuong + ":3000/products/" + id;
  const { t } = useTranslation('product');

  useEffect(() => {
    setIsFavorite(favorite);
  }, []);
  console.log(111111, isFavorite);

  let productCarts = {
    size: selectedSize,
    price: money,
    nameProduct: namePro,
    description: withwhere,
    image: data,
    quantity: 1,
    category: category,
  };
  let productFavorite = {
    price: money,
    nameProduct: namePro,
    description: withwhere,
    image: data,
    isFavorite: !isFavorite,
    category: category,
  };

  const updateFavorite = (productFavorite) => {
    fetch(url_apiPro, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productFavorite),
    })
      .then((res) => {
        if (res.status == 200) {
          alert("Sửa thành công");
        }
      })
      .catch((ex) => {
        console.log(ex);
      });
  };

  const saveDataToCartAPI = (productCart) => {
    fetch(url_api, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productCart),
    })
      .then((res) => {
        if (res.status == 201) console.log("addcomplete");
        Alert.alert("Notification", "Add to cart complete");
      })
      .catch((er) => console.error(er));
  };

  const handleAddToCartPress = () => {
    saveDataToCartAPI(productCarts);
  };

  const handleSizePress = (size) => {
    setSelectedSize(size);
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
    updateFavorite(productFavorite);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          position: "relative",
          backgroundColor: theme.colors.background,
        },
        imageContainer: {
          position: "relative",
        },
        image: {
          width: "100%",
          height: 300,
        },
        overlay: {
          ...StyleSheet.absoluteFillObject,
          justifyContent: "flex-end",
          alignItems: "flex-start",
          paddingBottom: 40,
          paddingLeft: 20,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        overlayTextLarge: {
          color: "white",
          fontSize: 18,
          fontWeight: "bold",
        },
        overlayTextSmall: {
          color: "white",
          fontSize: 14,
          fontWeight: "normal",
        },
        overlayBottom: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 5,
          backgroundColor: "black",
        },
        information: {
          marginTop: 10,
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: theme.colors.background, // Thêm backgroundColor
          borderRadius: 20,
        },
        flexRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 23,
          marginTop: 30,
          marginBottom: 30,
        },
        flexRow1: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 23,
          marginBottom: 30,
        },
        boxSize: {
          height: 40,
          width: 100,
          borderRadius: 10,
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.card,
        },
        btnAdd: {
          backgroundColor: "#005223",
          width: 300,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
          alignSelf: "center",
          marginTop: 100,
        },
        backButton: {
          position: "absolute",
          top: 50,
          left: 20,
          zIndex: 1,
        },
        favoriteButton: {
          position: "absolute",
          top: 50,
          right: 20,
          zIndex: 1,
        },
        heartIcon: {
          fontWeight: "bold",
        },
        textSize: {
          fontSize: 25, 
          fontWeight: "bold", 
          color: theme.colors.text, // Set text color
        },
        textSize1: {
          fontSize: 16, 
          fontWeight: "bold", 
          color: theme.colors.text, // Set text color
        }
      }),
    [theme]
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: data }} />
        <View style={styles.overlay}>
          <Text style={styles.overlayTextLarge}>{namePro}</Text>
          <Text style={styles.overlayTextSmall}>{withwhere}</Text>
        </View>
        <View style={styles.overlayBottom} />
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => {
            handleFavoritePress();
          }}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={30}
            color="#FF0000"
            style={styles.heartIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.information}>
        <View style={styles.flexRow}>
          <Text style={styles.textSize}>{t('product.size')}</Text>
        </View>
        <View style={styles.flexRow1}>
          <TouchableOpacity
            style={[
              styles.boxSize,
              selectedSize === "small" && {
                borderColor: "#015C33",
                backgroundColor: "#015C33",
              },
            ]}
            onPress={() => handleSizePress("small")}
          >
            <Text style={styles.textSize1}>{t('product.small')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boxSize,
              selectedSize === "medium" && {
                borderColor: "#015C33",
                backgroundColor: "#015C33",
              },
            ]}
            onPress={() => handleSizePress("medium")}
          >
            <Text style={styles.textSize1}>{t('product.medium')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boxSize,
              selectedSize === "large" && {
                borderColor: "#015C33",
                backgroundColor: "#015C33",
              },
            ]}
            onPress={() => handleSizePress("large")}
          >
            <Text style={styles.textSize1}>{t('product.large')}</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginStart: 25,
            marginTop: 30,
            color: theme.colors.text, // Set text color
          }}
        >{t('product.description')}</Text>
        <Text style={{ marginHorizontal: 25, marginTop: 10, color: theme.colors.text }}>{t('product.text')}</Text>
        <TouchableOpacity style={styles.btnAdd} onPress={handleAddToCartPress}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          {t('product.add-to-cart')} | ${money}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


export default Product;
