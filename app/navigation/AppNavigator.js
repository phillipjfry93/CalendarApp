import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import AccountNavigator from "./AccountNavigator";
import colors from "../config/colors";
import CalendarNavigator from "./CalendarNavigator";
import ScheduleScreen from "../screens/SceduleScreen";
import useAuth from "../auth/useAuth";
import listings from "../api/listings";
import UserAccountNavigator from "./UserAccountNavigator";
import ProfileViewNavigator from "./ProfileViewNavigator";
import Notifications from "../api/Notifications";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { user } = useAuth();
  const [isBusiness, setIsBusiness] = useState();
  const [badge, setBadge] = useState();

  useEffect(() => {
    const getBadges = async () => {
      const messages = await listings.getMessageBadges();

      if (isBusiness == true) {
        const count = await listings.getRequestBadges();
        if (badge != count + messages) {
          setBadge(count + messages);
        }
      } else {
        if (badge != messages && messages != 0) {
          setBadge(messages);
        }
      }
    };
    getBadges();

    if (badge == 0) {
      setBadge(undefined);
    }

    console.log("Fetched badges!");
  }, [isBusiness]);

  setInterval(() => {
    const getBadges = async () => {
      const messages = await listings.getMessageBadges();
      const count = await listings.getRequestBadges();

      if (isBusiness == true) {
        if (badge != count + messages) {
          setBadge(count + messages);
        }
      } else {
        if (badge != messages && messages != 0) {
          setBadge(messages);
        }
      }
    };
    getBadges();

    if (badge === 0) {
      setBadge(undefined);
    }
  }, 5000);

  const type = async (profile) => {
    const bool = await listings.pullProfileType(profile.email);
    setIsBusiness(bool);
  };
  type(user);

  return (
    <Tab.Navigator
      initialRouteName="Agenda"
      tabBarOptions={{
        tabStyle: {
          borderColor: colors.black,
          borderTopWidth: 2,
        },
      }}
    >
      {isBusiness ? (
        <Tab.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="briefcase-clock"
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Discover"
          component={ProfileViewNavigator}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="briefcase-search"
                color={color}
                size={size}
              />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="Agenda"
        component={CalendarNavigator}
        options={{
          //tabBarButton: ({ color }) => <NewListingButton color={color} onPress={() => navigation.navigate("WeekCalendar")} />,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="notebook" color={color} size={size} />
          ),
        }}
      />
      {isBusiness ? (
        <Tab.Screen
          name="Profile"
          component={AccountNavigator}
          options={{
            tabBarBadge: badge,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Profile"
          component={UserAccountNavigator}
          options={{
            tabBarBadge: badge,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  seperator: {
    width: "90%",
    left: 20,
    height: 1,

    backgroundColor: colors.black,
  },
});

export default AppNavigator;
