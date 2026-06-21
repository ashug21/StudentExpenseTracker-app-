import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddExpense() {
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    { name: "Food", icon: "fast-food-outline" },
    { name: "Transport", icon: "car-outline" },
    { name: "Shopping", icon: "bag-outline" },
    { name: "Entertainment", icon: "game-controller-outline" },
  ];


  const addUserExpense = async () => {
    if (!expenseName || !amount || !category) {
      alert("All Fields are Required!");
      return;
    }
  
    try {
      const token = await SecureStore.getItemAsync("token");
  
      const response = await fetch(
        "http://192.168.87.6:5500/expense/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            expenseName,
            amount: Number(amount),
            category,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message);
        return;
      }
  
      setExpenseName("");
      setAmount("");
      setCategory("");
  
      alert("Expense Added Successfully");
    } 
    catch (error) {
     
      console.log(error);
      alert(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.heading}>Add Expense</Text>
        <Text style={styles.subHeading}>
          Track your spending and stay on budget.
        </Text>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Expense Amount</Text>
          <Text style={styles.amountValue}>
            ₹ {amount.length > 0 ? amount : "0.00"}
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Expense Name</Text>

          <TextInput
            placeholder="e.g. Uber Ride"
            placeholderTextColor="#94A3B8"
            value={expenseName}
            onChangeText={setExpenseName}
            style={styles.input}
          />

          <Text style={styles.label}>Amount</Text>

          <TextInput
            placeholder="Enter Amount"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />
        </View>

        <Text style={styles.sectionTitle}>Category</Text>

        <View style={styles.categoryGrid}>
          {categories.map((item) => (
            <Pressable
              key={item.name}
              style={[
                styles.categoryCard,
                category === item.name && styles.activeCategory,
              ]}
              onPress={() => setCategory(item.name)}
            >
              <Ionicons
                name={item.icon as any}
                size={28}
                color={category === item.name ? "#FFFFFF" : "#2563EB"}
              />

              <Text
                style={[
                  styles.categoryText,
                  category === item.name && styles.activeCategoryText,
                ]}
              >
                {item.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.button} onPress={addUserExpense}>
          <Text style={styles.buttonText}>Add New Expense</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 10,
  },

  subHeading: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 28,
  },

  amountCard: {
    backgroundColor: "#632acd",
    borderRadius: 30,
    paddingVertical: 34,
    alignItems: "center",
    marginBottom: 24,
  },

  amountLabel: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
  },

  amountValue: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
    marginTop: 10,
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 4,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 10,
  },

  input: {
    height: 62,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#37518e",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
    marginBottom: 32,
  },

  categoryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  activeCategory: {
    backgroundColor: "#2563EB",
    transform: [{ scale: 1.03 }],
  },

  categoryText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  activeCategoryText: {
    color: "#FFFFFF",
  },

  button: {
    height: 64,
    backgroundColor: "#2563EB",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});