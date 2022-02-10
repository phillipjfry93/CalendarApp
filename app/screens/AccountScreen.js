import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/core";

import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import Icon from "../components/Icon";
import ListItemSeperator from "../components/ListItemSeperator";
import useAuth from "../auth/useAuth";
import listings from "../api/listings";

const menuItems = [
  {
    title: "Requests",
    icon: {
      name: "alarm-check",
      backgroundColor: colors.primary,
    },
    key: "Dates",
    targetScreen: "Dates",
  },
  {
    title: "Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    key: "Messages",
    targetScreen: "Messages",
  },
  {
    title: "Settings",
    icon: {
      name: "account-cog",
      backgroundColor: "#cdc392",
    },
    key: "Settings",
    targetScreen: "Settings",
  },
  {
    title: "Help & Support",
    icon: {
      name: "head-question",
      backgroundColor: colors.blue,
    },
    key: "Help",
    targetScreen: "Help",
  },
];

function AccountScreen({ navigation }) {
  const isFocused = useIsFocused();

  const { user, logOut } = useAuth();
  const [name, setName] = useState("");
  const [pic, setPic] = useState(" ");

  useEffect(() => {
    const refresh = navigation.addListener("focus", () => {
      getPic();
    });
    return refresh;
  }, [isFocused]);

  const getName = async () => {
    const name = await listings.getName(user.email);
    setName(name);
  };
  var email = user.email.charAt(0).toUpperCase() + user.email.slice(1);

  const getPic = async () => {
    //const picture = await listings.pullImage(user.email);
    const picture = await listings.getProfilePic(user.email);
    setPic(picture);
  };

  getName();
  getPic();

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={name}
          subTitle={email}
          image={pic}
          onPress={() =>
            navigation.navigate("Edit Profile", {
              name: name,
              email: user.email,
              pic: pic,
            })
          }
          key="one"
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          scrollEnabled={false}
          //keyExtractor={(menuItem) => menuItems.title}
          ItemSeparatorComponent={ListItemSeperator}
          contentContainerStyle={{
            borderRadius: 25,
            width: "99%",
            backgroundColor: colors.white,
            overflow: "hidden",
          }}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon name={item.icon.name} backgroundColor={colors.medium} />
              }
              onPress={() =>
                navigation.navigate(item.targetScreen, {
                  email: user.email,
                  name: name,
                  pic: pic,
                })
              }
            />
          )}
        />
      </View>
      <View style={styles.container}>
        <ListItem
          title="Log Out"
          IconComponent={<Icon name="logout" backgroundColor={colors.red} />}
          onPress={() => logOut()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 3,
    width: "97%",
    alignSelf: "center",
    borderColor: colors.black,
  },
  screen: {
    backgroundColor: colors.blue,
  },
});

export default AccountScreen;
