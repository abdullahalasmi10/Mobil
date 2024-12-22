import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";

const AuthGuard = ({ children, allowedRole }) => {
  const { user } = useGlobalContext();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/auth/sign-in");
    } else if (allowedRole && user.role !== allowedRole) {
      router.replace(user.role === "admin" ? "/home" : "/user");
    } else {
      setIsAuthorized(true);
    }
  }, [user, allowedRole]);

  if (!isAuthorized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return children;
};

export default AuthGuard;
