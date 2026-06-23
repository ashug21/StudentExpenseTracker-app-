import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
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
import { useAuth } from "../../context/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInUser = async () => {
    try {
      if (!email || !password) {
        alert("Please fill all fields");
        return;
      }

      const response = await fetch(
        // "http://192.168.87.6:5500/api/auth/login"
        "https://spendly-api-3e2b.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      await login(data.token);

      alert("Logged In Successfully!");

      router.replace("/(root)/(tabs)");
    } catch (error) {
      console.log("Login Error:", error);
      alert("Could not connect to server.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Ionicons name="wallet-outline" size={42} color="#FFFFFF" />
          </View>

          <Text style={styles.appName}>Student Expense Tracker</Text>

          <Text style={styles.heading}>Welcome Back 👋</Text>

          <Text style={styles.subHeading}>
            Continue tracking your expenses and stay on top of your finances.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <Pressable onPress={signInUser} style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?
            </Text>

            <Link href="/sign-up" asChild>
              <Pressable>
                <Text style={styles.linkText}> Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <View style={styles.quoteContainer}>
          <Text style={styles.quote}>
            "Every expense tells a story. Track it wisely."
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  hero: {
    marginTop: 50,
    marginBottom: 35,
  },

  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,

    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 8,
  },

  appName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
    marginBottom: 12,
  },

  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 42,
  },

  subHeading: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 24,
    color: "#64748B",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 24,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 24,
  },

  input: {
    height: 62,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    color: "#0F172A",
  },

  button: {
    height: 62,
    backgroundColor: "#2563EB",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,

    elevation: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  footerText: {
    color: "#64748B",
    fontSize: 15,
  },

  linkText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 15,
  },

  quoteContainer: {
    marginTop: 24,
    alignItems: "center",
  },

  quote: {
    fontSize: 14,
    color: "#94A3B8",
    fontStyle: "italic",
    textAlign: "center",
  },
});