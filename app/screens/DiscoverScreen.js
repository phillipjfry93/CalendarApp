import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, SafeAreaView, View, Text } from "react-native";
import { Searchbar } from "react-native-paper";

import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import Button from "../components/AppButton";
import Card from "../components/Card";
import colors from "../config/colors";
import listings from "../api/listings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import useApi from "../hooks/useApi";

function DiscoverScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState();
  const [results, setResults] = useState(false);
  const [didSearch, setDidSearch] = useState("Search by name or email.");
  const [tempResults, setTempResults] = useState([
    {
      email: "none",
      key: 0,
      id: "",
      pic: "",
    },
  ]);

  const getListingsApi = useApi(listings.getListings);

  useEffect(() => {
    listings.getSearchResults();
  }, []);

  const searchFuntion = async (text) => {
    setSearchQuery(text);
    if (text == "") {
      setResults(false);
    } else {
      const results = await listings.getSearchResults(text);
      if (results == undefined || results === []) {
        setDidSearch("No results found.");
        setResults(false);
      } else {
        setTempResults(results);
        setResults(true);
        setDidSearch("Search by name or email.");
        console.log(tempResults);
      }
    }
  };

  const clickedProfile = (email, pic, name) => {
    navigation.navigate("ProfileView", {
      name: name,
      pic: pic,
      email: email,
    });
  };

  //Onclick to the business profile now!

  return (
    <>
      <ActivityIndicator visible={getListingsApi.loading} />
      <Screen style={styles.container}>
        <Searchbar
          style={styles.search}
          placeholder="Search"
          onChangeText={searchFuntion}
          value={searchQuery}
          collapsable={true}
        />
        {results ? (
          <FlatList
            data={tempResults}
            keyExtractor={(item) => "" + item.id}
            style={styles.list}
            renderItem={({ item }) => (
              <Card
                title={item.email}
                subTitle={"business"}
                onPress={() => clickedProfile(item.email, item.pic, item.name)}
                thumbnailUrl={item.pic}
                imageUrl={item.pic.replace("file://", "")}
              />
            )}
          />
        ) : (
          <>
            <View style={styles.beforeView}>
              <Text style={styles.beforeSearch}>{didSearch}</Text>
            </View>
          </>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  beforeView: {
    flex: 1,
    justifyContent: "center",
  },
  beforeSearch: {
    textAlign: "center",
    fontSize: 30,
    color: "#1D3D72",
    fontWeight: "bold",
  },
  container: {
    backgroundColor: colors.blue,
    padding: 10,
  },
  list: {
    paddingTop: 10,
  },
  search: {
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 25,
  },
  searchResults: {
    backgroundColor: colors.white,

    alignSelf: "center",
    paddingTop: 30,
    position: "absolute",
  },
});

export default DiscoverScreen;
