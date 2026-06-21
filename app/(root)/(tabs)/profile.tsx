import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const [income, setIncome] = useState("");

  const handleLogout = async () => {
    await logout();
    router.replace("/sign-in");
  };

  const setUserIncome = async () => {
    Keyboard.dismiss();

    if (!income) {
      Alert.alert("Error", "Please enter your monthly income");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("token");

      const response = await fetch(
        "http://192.168.87.6:5500/expense/set-income",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            income: Number(income),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message);
        return;
      }

      setIncome("");

      Alert.alert("Success", "Income updated successfully");
    } catch (error: any) {
      console.log(error);

      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      <Text style={styles.subHeading}>Manage your financial settings.</Text>

      <View style={styles.incomeCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="cash-outline" size={26} color="#10B981" />
        </View>

        <Text style={styles.cardTitle}>Monthly Income</Text>

        <Text style={styles.cardSubtitle}>
          Set or update your monthly income.
        </Text>

        <TextInput
          placeholder="Enter Monthly Income"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          value={income}
          onChangeText={setIncome}
          style={styles.input}
        />

        <Pressable style={styles.saveButton} onPress={setUserIncome}>
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />

          <Text style={styles.saveButtonText}>Save Income</Text>
        </Pressable>
      </View>

      <Pressable
  style={styles.logoutCard}
  onPress={handleLogout}
>
  <View style={styles.logoutLeft}>
    <View style={styles.logoutIconContainer}>
      <Ionicons
        name="log-out-outline"
        size={22}
        color="#EF4444"
      />
    </View>

    <View>
      <Text style={styles.logoutTitle}>
        Logout
      </Text>

      <Text style={styles.logoutDescription}>
        Sign out of your account
      </Text>
    </View>
  </View>

  <Ionicons
    name="chevron-forward"
    size={20}
    color="#94A3B8"
  />
</Pressable>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
  },

  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 20,
  },

  subHeading: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 28,
  },

  incomeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 4,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 18,
  },

  input: {
    height: 60,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  saveButton: {
    height: 56,
    backgroundColor: "#10B981",
    borderRadius: 18,
    marginTop: 16,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  logoutButton: {
    height: 60,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#FECACA",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  logoutText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "700",
  },

  logoutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
  
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  
    elevation: 3,
  },
  
  logoutLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  logoutIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  
  logoutTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#EF4444",
  },
  
  logoutDescription: {
    marginTop: 3,
    fontSize: 13,
    color: "#64748B",
  },
});
