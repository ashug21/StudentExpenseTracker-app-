import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Keyboard,
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
    if (!expenseName.trim() || !amount.trim() || !category) {
      alert("All Fields are Required!");
      return;
    }
    if (Number(amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch("http://192.168.87.6:5500/expense/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ expenseName, amount: Number(amount), category }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      Keyboard.dismiss();
      setExpenseName("");
      setAmount("");
      setCategory("");
      alert("Expense Added Successfully");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.heading}>Add Expense</Text>
        <Text style={styles.subHeading}>Track every rupee you spend</Text>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Expense Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="create-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="Starbucks Coffee"
              placeholderTextColor="#94A3B8"
              value={expenseName}
              onChangeText={setExpenseName}
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="cash-outline" size={20} color="#64748B" />
            <TextInput
              placeholder="350"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.categoryContainer}>
          {categories.map((item) => (
            <Pressable
              key={item.name}
              style={[
                styles.categoryPill,
                category === item.name && styles.activeCategoryPill,
              ]}
              onPress={() => setCategory(item.name)}
            >
              <Ionicons
                name={item.icon as any}
                size={18}
                color={category === item.name ? "#10B981" : "#64748B"}
              />
              <Text
                style={[
                  styles.categoryPillText,
                  category === item.name && styles.activeCategoryPillText,
                ]}
              >
                {item.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* <Text style={styles.sectionTitle}>Preview</Text>
        <View style={styles.previewCard}>
          <View>
            <Text style={styles.previewName}>
              {expenseName || "Expense Name"}
            </Text>
            <Text style={styles.previewCategory}>
              {category || "Select Category"}
            </Text>
          </View>
          <Text style={styles.previewAmount}>₹{amount || "0"}</Text>
        </View> */}

        <Pressable style={styles.button} onPress={addUserExpense}>
          <Ionicons
            name="add-circle"
            size={22}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Add Expense</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 34, fontWeight: "800", color: "#0F172A" },
  subHeading: {
    color: "#64748B",
    marginTop: 6,
    marginBottom: 24,
    fontSize: 15,
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 10,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    paddingHorizontal: 14,
  },
  input: { flex: 1, height: 56, marginLeft: 10, color: "#0F172A" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 24,
    marginBottom: 14,
  },
  categoryContainer: { flexDirection: "row", flexWrap: "wrap" },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  activeCategoryPill: { backgroundColor: "#ECFDF5", borderColor: "#10B981" },
  categoryPillText: { marginLeft: 6, color: "#334155", fontWeight: "600" },
  activeCategoryPillText: { color: "#10B981" },
  previewCard: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewName: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  previewCategory: { color: "#94A3B8", marginTop: 4 },
  previewAmount: { color: "#10B981", fontSize: 28, fontWeight: "800" },
  button: {
    marginTop: 24,
    backgroundColor: "#10B981",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
});