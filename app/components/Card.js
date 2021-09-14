import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "./AppText";
import colors from "../config/colors";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";

function Card({ title, subTitle, imageUrl, onPress, thumbnailUrl }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <Image
          style={styles.image}
          tint="light"
          preview={{ uri: thumbnailUrl }}
          uri={imageUrl}
        />
        <View style={styles.detailContainer}>
          <AppText style={styles.title}>{"Business Name"}</AppText>
          <AppText style={styles.subTitle}>{"Star Rating"}</AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: "hidden",
  },
  detailContainer: {
    borderTopColor: colors.medium,
    borderTopWidth: 1,
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 4,
  },
  image: {
    width: "100%",
    height: 200,
  },
  subTitle: {
    color: colors.secondary,
    fontWeight: "bold",
  },
  title: {
    marginBottom: 7,
  },
});
export default Card;
