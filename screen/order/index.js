import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import card from '../../assets/debitCard.png';
import cash from '../../assets/cash.jpeg';
import bankTransfer from '../../assets/bankTransfer.jpeg';
import apiUrl from "../../apiUrl";
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../theme/ThemeContext'; // Import ThemeContext

const url_api_orders = "http://" + apiUrl.thuong + ":3000/orders";

const url_cart_del = "http://" + apiUrl.thuong + ":3000/cart/";

const Order = ({ navigation }) => {
  const { t } = useTranslation('order');
  const { theme } = useContext(ThemeContext); // Use theme from ThemeContext

  const route = useRoute();
  const { money, data } = route.params || {};
  var idArray = data.map(function (item) {
    return item.id;
  });

  const [paymentsBtn, setPaymentsBtn] = useState('Debit Card');
  const handlePaymentMethod = (method) => {
    // Perform actions based on the selected payment method
    console.log(`Selected payment method: ${method}`);
    setPaymentsBtn(method);
  };

  const handleBackPress = () => {
    navigation.navigate('Cart');
  };

  const hanldlePayment = () => {
    saveToOrders();
  }

  const saveToOrders = () => {
    fetch(url_api_orders, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (res.status == 201) {
          console.log('Add To Orders');
          for (let i = 0; i <= idArray.length; i++) {
            deleteCarts(idArray[i]);
          }
          navigation.navigate("OrderDetail");

        }
      })
      .catch((ex) => {
        console.log(ex);
      });

  }
  const deleteCarts = (id) => {

    fetch(url_cart_del + id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (res.status == 201) {
          console.log('delete');
        }
      })
      .catch((ex) => {
        console.log(ex);
      });
  }


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="arrow-back" style={{ marginStart: 20 }} size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: theme.colors.text }]}>{t('order.heading')}</Text>
      </View>
      <TouchableOpacity
        style={[styles.paymentButton, ]}
        onPress={() => handlePaymentMethod('Debit Card')}
      >
        <Image source={card} style={styles.image} />
        <Text style={[styles.buttonText, { color: theme.colors.text }]}>{t('order.debitCard')}</Text>
        <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => handlePaymentMethod('Cash')}
      >
        <Image source={cash} style={styles.icon} />
        <Text style={[styles.buttonText, { color: theme.colors.text }]}>{t('order.cash')}</Text>
        <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => handlePaymentMethod('Bank Transfer')}
      >
        <Image source={bankTransfer} style={styles.icon} />
        <Text style={[styles.buttonText, { color: theme.colors.text }]}>{t('order.bankTransfer')}</Text>
        <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      {/* Thêm dòng mới cho giá và nút Pay */}
      <View style={[styles.bottomRow, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.totalText, { color: theme.colors.text }]}>{t('order.total')} ${money}</Text>
        <TouchableOpacity
          style={styles.payButton}
          onPress={hanldlePayment}
        >
          <Text style={[styles.payButtonText, { color: theme.colors.text }]}>{t('order.pay')} {paymentsBtn}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 70,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 30,
  },
  paymentButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'black',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  payButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Order;
