import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState([]);

  const [income, setIncome] = useState(null);

  const [name, setName] = useState("");
  const [expenseCount, setExpenseCount] = useState(0);
  const [currency, setCurrency] = useState("INR");

  const calculateTotalExpenses = () => {
    return data.reduce((total, expense) => {
      return total + Number(expense.amount);
    }, 0);
  };

  const calculateBalance = () => {
    const expense = calculateTotalExpenses();

    if (income == null) {
      return 0;
    }
    const balance = income - expense;
    return balance;
  };
  const getUserIncome = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      const res = await fetch("http://192.168.87.6:5500/expense/income", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }
      setName(data.name || "");
      setIncome(data.income || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const emojiSetter = (category: string, expenseName: string) => {
    const name = expenseName.toLowerCase();

    if (name === "dinner" || name === "breakfast" || name === "lunch") {
      return "🍽️";
    }

    if (name.includes("kfc")) {
      return "🍗";
    }

    if (name === "mcd" || name === "mcdonalds") {
      return "🍟";
    }

    if (name === "dominos" || name === "pizza" || name === "pizzahut") {
      return "🍕";
    }

    if (name.includes("coffee") || name === "starbucks") {
      return "☕️";
    }

    if (name.includes("tea") || name.includes("chai")) {
      return "🍵";
    }

    if (
      name === "gas" ||
      name === "fuel" ||
      name === "petrol" ||
      name === "diesel"
    ) {
      return "⛽️";
    }

    if (
      name === "mobile" ||
      name === "phone" ||
      name === "iphone" ||
      name === "android" ||
      name === "samsung"
    ) {
      return "📱";
    }

    if (
      name === "laptop" ||
      name === "computer" ||
      name === "pc" ||
      name.includes("macbook") ||
      name.includes("dell")
    ) {
      return "💻";
    }

    if (name.includes("gym")) {
      return "🏋🏼‍♂️";
    }

    if (name === "headphones" || name === "earphones") {
      return "🎧";
    }

    if (name === "party" || name.includes("birthday")) {
      return "🥳🎁";
    }

    if (category === "Transport") {
      return "🚗";
    }

    if (category === "Food") {
      return "🍔";
    }

    if (category === "Shopping") {
      return "🛍️";
    }

    if (category === "Entertainment") {
      return "🎮";
    }

    return "💰";
  };

  const getUserExpenses = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const res = await fetch("http://192.168.87.6:5500/expense/user", {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);

        return;
      }

      setData(data.expenses || []);
    } catch (error) {
      console.log(error);

      alert(error);
    }
  };

  const countUserExpenses = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const res = await fetch("http://192.168.87.6:5500/expense/count", {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);

        return;
      }

      setExpenseCount(data.count || 0);
    } catch (error) {
      console.log(error);

      alert(error);
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      const token = await SecureStore.getItemAsync("token");

      const res = await fetch(`http://192.168.87.6:5500/expense/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message);
        return;
      }

      getUserExpenses();

      Alert.alert("Success", "Expense deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const getUserCurrency = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      const response = await fetch(
        "http://192.168.87.6:5500/expense/get-currency",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message);
        return;
      }

      setCurrency(data.currency || "INR");
    } catch (error) {
      console.log(error);
    }
  };

  const exchangeRates = {
    INR: 1,
    AUD: 0.018,
    USD: 0.012,
    GBP: 0.0086,
    EUR: 0.01,
    NZD: 0.02,
  };

  const currencySymbols = {
    INR: "₹",
    AUD: "A$",
    USD: "$",
    GBP: "£",
    EUR: "€",
    NZD: "NZ$",
  };

  const convertAmount = (amount: number) => {
    const rate = exchangeRates[currency as keyof typeof exchangeRates] || 1;

    return (amount * rate).toFixed(2);
  };

  const getCurrencySymbol = () => {
    return currencySymbols[currency as keyof typeof currencySymbols] || "₹";
  };

  // "INR",
  // "AUD",
  // "USD",
  // "GBP",
  // "EUR",
  // "NZD",

  useFocusEffect(
    useCallback(() => {
      getUserExpenses();
      getUserIncome();
      countUserExpenses();
      getUserCurrency();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.name}>{name ? name : "Client"}</Text>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>

          <Text style={styles.balanceAmount}>
            {getCurrencySymbol()}
            {convertAmount(calculateBalance())}
          </Text>

          <View style={styles.balanceStats}>
            <View>
              <Text style={styles.statLabel}>Income</Text>

              {income ? (
                <Text style={styles.income}>
                  {getCurrencySymbol()}
                  {convertAmount(Number(income))}
                </Text>
              ) : (
                <Pressable onPress={() => router.push("/profile")}>
                  <Text style={styles.income}>Set Income</Text>
                </Pressable>
              )}
            </View>

            <View>
              <Text style={styles.statLabel}>Expense</Text>
              <Text style={styles.expense}>
                {getCurrencySymbol()}
                {convertAmount(calculateTotalExpenses())}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            onPress={() => router.push("/addexpense")}
            style={styles.actionCard}
          >
            <Ionicons name="add-circle" size={34} color="#2563EB" />
            <Text style={styles.actionText}>Add Expense</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/viewexpenses")}
            style={styles.actionCard}
          >
            <Ionicons name="eye" size={34} color="#2563EB" />
            <Text style={styles.actionText}>View Expense</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>
          Recent Expenses ({expenseCount})
        </Text>

        <Text style={styles.guide}>(Hold to delete expenses)</Text>

        {data.length === 0 ? (
          <View style={styles.expenseCard}>
            <Text style={styles.expenseCategory}>No Expenses Added</Text>
          </View>
        ) : (
          // only typescript error dont worry
          data.map((expense) => (
            <Pressable
              key={expense.id}
              style={styles.expenseCard}
              onLongPress={() =>
                Alert.alert(
                  "Delete Expense",
                  `Delete ${expense.expensename}?`,
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => deleteExpense(expense.id),
                    },
                  ]
                )
              }
            >
              <View>
                <Text style={styles.expenseName}>
                  {emojiSetter(expense.category, expense.expensename)}{" "}
                  {expense.expensename}
                </Text>

                <Text style={styles.expenseCategory}>{expense.category}</Text>
              </View>

              <Text style={styles.expensePrice}>
                - {getCurrencySymbol()}
                {convertAmount(Number(expense.amount))}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    marginTop: 20,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },

  name: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 4,
  },

  profileCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },

  balanceCard: {
    backgroundColor: "#0F172A",
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 28,
    padding: 24,
  },

  balanceLabel: {
    color: "#CBD5E1",
    fontSize: 14,
  },

  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 24,
  },

  balanceStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statLabel: {
    color: "#94A3B8",
    fontSize: 13,
  },

  income: {
    color: "#10B981",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },

  expense: {
    color: "#EF4444",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },

  actionRow: {
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
    marginTop: 24,
  },

  actionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  actionText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  sectionTitle: {
    marginTop: 32,
    marginHorizontal: 20,
    marginBottom: 16,
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  expenseCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  expenseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },

  expenseCategory: {
    marginTop: 3,
    color: "#64748B",
    fontSize: 13,
  },

  expensePrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EF4444",
  },
  guide: {
    marginLeft: 22,
    marginBottom: 15,
    color: "#a5a3a2",
  },
});
