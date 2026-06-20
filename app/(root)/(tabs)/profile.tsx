import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const Profile = () => {

  const { logout } = useAuth();
  const router = useRouter();


  const handleLogout = async () => {

    await logout();
  
    router.replace("/sign-in");
  
  };
 

  return (
    <SafeAreaView>
      <Text style={styles.agendaHeading}>What's the Agenda Today?</Text>

      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />

        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  logoutButton: {
    height: 60,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#FECACA",
    width : 280,
    marginLeft : 39,
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

  agendaHeading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.8,
    marginBottom: 80,
    marginTop: 100,
  },
});
