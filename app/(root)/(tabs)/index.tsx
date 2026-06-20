import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.name}>Ashmeet</Text>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>

          <Text style={styles.balanceAmount}>₹12,450</Text>

          <View style={styles.balanceStats}>
            <View>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.income}>₹8,000</Text>
            </View>

            <View>
              <Text style={styles.statLabel}>Expense</Text>
              <Text style={styles.expense}>₹2,500</Text>
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

        <Text style={styles.sectionTitle}>Recent Expenses</Text>

        <View style={styles.expenseCard}>
          <View>
            <Text style={styles.expenseName}>🍔 Burger King</Text>
            <Text style={styles.expenseCategory}>Food</Text>
          </View>

          <Text style={styles.expensePrice}>₹250</Text>
        </View>

        <View style={styles.expenseCard}>
          <View>
            <Text style={styles.expenseName}>🚕 Uber</Text>
            <Text style={styles.expenseCategory}>Transport</Text>
          </View>

          <Text style={styles.expensePrice}>₹180</Text>
        </View>

        <View style={styles.expenseCard}>
          <View>
            <Text style={styles.expenseName}>☕ Coffee</Text>
            <Text style={styles.expenseCategory}>Food</Text>
          </View>

          <Text style={styles.expensePrice}>₹120</Text>
        </View>

     
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
});
