import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewExpenses() {
  const [data, setData] = useState<any[]>([]);

  const [currency, setCurrency] = useState("INR");

  const getUserExpenses = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      const res = await fetch("http://192.168.87.6:5500/expense/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await res.json();

      if (!res.ok) {
        alert(response.message);
        return;
      }

      setData(response.expenses || []);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch expenses");
    }
  };

  const groupedExpenses = data.reduce((acc: any, expense: any) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }

    acc[expense.category].push(expense);

    return acc;
  }, {});

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Food":
        return "restaurant";

      case "Shopping":
        return "bag-handle";

      case "Transport":
        return "car";

      case "Entertainment":
        return "game-controller";

      default:
        return "wallet";
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

  const conversionRates = {
    INR: 1,
    AUD: 65.46,
    USD: 94.66,
    GBP: 124.92,
    EUR: 107.65,
    NZD: 53.56,
  };

  const currencySymbols = {
    INR: "₹",
    AUD: "A$",
    USD: "$",
    GBP: "£",
    EUR: "€",
    NZD: "NZ$",
  };

  const convertAmount = (amountInINR: number) => {
    if (currency === "INR") {
      return amountInINR.toFixed(2);
    }

    return (
      amountInINR / conversionRates[currency as keyof typeof conversionRates]
    ).toFixed(2);
  };

  useFocusEffect(
    useCallback(() => {
      getUserExpenses();
      getUserCurrency();
    }, [])
  );


  const totalExpenses = data.reduce((total, expense) => {
    return total + Number(expense.amount);
  }, 0);
  
  const foodExpenses =
    groupedExpenses["Food"]?.reduce(
      (total: number, expense: any) => total + Number(expense.amount),
      0
    ) || 0;
  
  const shoppingExpenses =
    groupedExpenses["Shopping"]?.reduce(
      (total: number, expense: any) => total + Number(expense.amount),
      0
    ) || 0;
  
  const transportExpenses =
    groupedExpenses["Transport"]?.reduce(
      (total: number, expense: any) => total + Number(expense.amount),
      0
    ) || 0;
  
  const entertainmentExpenses =
    groupedExpenses["Entertainment"]?.reduce(
      (total: number, expense: any) => total + Number(expense.amount),
      0
    ) || 0;

    const billsExpenses =
    groupedExpenses["Bills"]?.reduce(
      (total: number, expense: any) => total + Number(expense.amount),
      0
    ) || 0;

    const travelExpenses =
    groupedExpenses["Travel"]?.reduce(
      (total: number, expense: any) => total + Number(expense.amount),
      0
    ) || 0;

    const otherExpenses =
    groupedExpenses["Other"]?.reduce(
      (total: number, expense: any) => total + Number(expense.amount),
      0
    ) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Expenses</Text>
          <Text style={styles.subHeading}>Category-wise expense breakdown</Text>

          <Text style={styles.guide}>(Hold an expense to delete)</Text>
        </View>
      </View>

     

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >

<View style={styles.analyticsCard}>
  <View style={styles.analyticsHeader}>
    <Ionicons name="pie-chart" size={22} color="#10B981" />
    <Text style={styles.analyticsTitle}>Spending Breakdown</Text>

  </View>

  <View style={styles.analyticsRow}>
    <Text style={styles.analyticsLabel}>🍔 Food</Text>
    <Text style={styles.analyticsValue}>
      {totalExpenses
        ? ((foodExpenses / totalExpenses) * 100).toFixed(1)
        : 0}
      %
    </Text>
  </View>

  <View style={styles.analyticsRow}>
    <Text style={styles.analyticsLabel}>🛍️ Shopping</Text>
    <Text style={styles.analyticsValue}>
      {totalExpenses
        ? ((shoppingExpenses / totalExpenses) * 100).toFixed(1)
        : 0}
      %
    </Text>
  </View>

  <View style={styles.analyticsRow}>
    <Text style={styles.analyticsLabel}>🚗 Transport</Text>
    <Text style={styles.analyticsValue}>
      {totalExpenses
        ? ((transportExpenses / totalExpenses) * 100).toFixed(1)
        : 0}
      %
    </Text>
  </View>

  <View style={styles.analyticsRow}>
    <Text style={styles.analyticsLabel}>🎮 Entertainment</Text>
    <Text style={styles.analyticsValue}>
      {totalExpenses
        ? ((entertainmentExpenses / totalExpenses) * 100).toFixed(1)
        : 0}
      %
    </Text>
  </View>

  <View style={styles.analyticsRow}>
    <Text style={styles.analyticsLabel}>💵 Bills</Text>
    <Text style={styles.analyticsValue}>
      {totalExpenses
        ? ((billsExpenses / totalExpenses) * 100).toFixed(1)
        : 0}
      %
    </Text>
  </View>

  <View style={styles.analyticsRow}>
    <Text style={styles.analyticsLabel}>✈️ Travel</Text>
    <Text style={styles.analyticsValue}>
      {totalExpenses
        ? ((travelExpenses / totalExpenses) * 100).toFixed(1)
        : 0}
      %
    </Text>
  </View>

  <View style={styles.analyticsRow}>
    <Text style={styles.analyticsLabel}>🧩 Other</Text>
    <Text style={styles.analyticsValue}>
      {totalExpenses
        ? ((otherExpenses / totalExpenses) * 100).toFixed(1)
        : 0}
      %
    </Text>
  </View>
</View>


        {Object.keys(groupedExpenses).length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="wallet-outline" size={55} color="#10b981" />
            </View>

            <Text style={styles.emptyTitle}>No Expenses Found</Text>

            <Text style={styles.emptySubtitle}>
              Your expenses will appear here once you start tracking them.
            </Text>
          </View>
        ) : (
          Object.entries(groupedExpenses).map(([category, expenses]: any) => (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIcon}>
                  <Ionicons
                    name={getCategoryIcon(category) as any}
                    size={22}
                    color="#10b981"
                  />
                </View>

                <View>
                  <Text style={styles.categoryHeading}>
                    {category} ({expenses.length})
                  </Text>
                </View>
              </View>

              {expenses.map((expense: any) => (
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
                      {expense.expensename}
                    </Text>

                    <Text style={styles.expenseDate}>
                      {new Date(expense.created_at).toLocaleDateString()}
                    </Text>
                  </View>

                  <Text style={styles.expenseAmount}>
                    {currencySymbols[currency as keyof typeof currencySymbols]}
                    {convertAmount(Number(expense.amount))}
                  </Text>
                </Pressable>
              ))}
            </View>
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
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 10,
    marginBottom: 20,
  },

  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
  },

  subHeading: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },

  categorySection: {
    marginBottom: 28,
  },

  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  categoryHeading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  categoryCount: {
    color: "#64748B",
    marginTop: 2,
  },

  expenseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E2E8F0",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  expenseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  expenseDate: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 13,
  },

  expenseAmount: {
    fontSize: 17,
    fontWeight: "700",
    color: "#EF4444",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },

  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  emptySubtitle: {
    marginTop: 10,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  guide: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 6,
  },

  analyticsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
  
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  
    elevation: 4,
  },
  
  analyticsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  
  analyticsTitle: {
    marginLeft: 8,
    marginBottom : 7,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  
  analyticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  
  analyticsLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  
  analyticsValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#10B981",
  },
});
