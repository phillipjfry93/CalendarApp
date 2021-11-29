import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import listings from "../api/listings";

import ListItem from "../components/ListItem";
import ListItemDeleteItem from "../components/ListItemDeleteItem";
import ListItemSeperator from "../components/ListItemSeperator";

import Screen from "../components/Screen";
import colors from "../config/colors";

/**
 * This function will contain a listing function that will search and the DB
 * with a forEach and display a listItem (just like accountScreen) and
 * when you click on each one send the information as params to ChatScreen
 */
const initialMessage = [
  {
    id: 1,
    title: "T1",
    description: "D1",
    image: require("../assets/mosh.jpg"),
  },
];

function MessageScreen({ navigation, route }) {
  const { email, name } = route.params;
  const [messages, setMessages] = useState(initialMessage);
  const [refreshing, setRefreshing] = useState(false);
  const [inbox, setInbox] = useState();

  //Next step is to pull the other user informatio from somewhere

  const getMessages = async () => {
    const inbox = await listings.getInbox();
    if (inbox != undefined) {
      setInbox(inbox);
    } else {
      setInbox(null);
    }
  };
  getMessages();

  const handleDelete = (message) => {
    //Delete the message from messages
    setMessages(messages.filter((m) => m.id !== message.id));
    //Call the server
  };
  if (inbox == null) {
    return (
      <Screen>
        <Text>Nothing to show</Text>
      </Screen>
    );
  } else {
    return (
      <Screen>
        <FlatList
          data={messages}
          keyExtractor={(message) => message.id.toString()}
          renderItem={({ item }) => (
            <ListItem
              title={inbox.email}
              subTitle={inbox.latestMessage}
              //image={item.image}
              onPress={() =>
                navigation.navigate("Chat", {
                  email: email,
                  name: name,
                  otherUser: inbox.email,
                })
              }
              renderRightActions={() => (
                <ListItemDeleteItem onPress={() => handleDelete(item)} />
              )}
            />
          )}
          ItemSeparatorComponent={ListItemSeperator}
          refreshing={refreshing}
          onRefresh={() => {
            getMessages();
          }}
        />
      </Screen>
    );
  }
}

export default MessageScreen;
