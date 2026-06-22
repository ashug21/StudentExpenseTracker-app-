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

  useFocusEffect(
    useCallback(() => {
      getUserExpenses();
    }, [])
  );

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
                  <Text style={styles.categoryHeading}>{category} ({expenses.length})</Text>   
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

                  <Text style={styles.expenseAmount}>₹{expense.amount}</Text>
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
});
