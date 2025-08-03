import { View, Text, Pressable, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

const Recipe = ({ foods }) => {
  const navigation = useNavigation();

  const renderItem = ({ item, index }) => (
    <ArticleCard item={item} index={index} navigation={navigation} />
  );

  return (
    <View style={recipeStyles.container}>
      <FlatList
        data={foods}
        keyExtractor={(item) => item.idFood}
        renderItem={renderItem}
        numColumns={2}
      />
    </View>
  );
};

const ArticleCard = ({ item, navigation }) => {
  return (
    <View style={recipeStyles.cardContainer} testID="articleDisplay">
      <TouchableOpacity
        onPress={() => navigation.navigate("RecipeDetail", { ...item })}
      >
        <Image
          source={{ uri: item.recipeImage }}
          style={recipeStyles.articleImage}
        />
        <Text style={recipeStyles.articleText}>
          {item.recipeName.length > 20 
            ? item.recipeName.slice(0, 20) + "..." 
            : item.recipeName}
        </Text>
        <Text style={recipeStyles.articleDescription}>
          {item.cookingDescription.length > 40 
            ? item.cookingDescription.slice(0, 40) + "..." 
            : item.cookingDescription}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const recipeStyles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
  },
  cardContainer: {
    justifyContent: "center",
    marginBottom: hp(1.5),
    flex: 1,
    paddingLeft: 20,
    paddingRight: 15,
  },
  articleImage: {
    width: "100%",
    height: hp(25),
    borderRadius: 35,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  articleText: {
    fontSize: hp(1.8),
    fontWeight: "600",
    color: "#52525B",
    marginLeft: wp(2),
    marginTop: hp(0.5),
  },
  articleDescription: {
    fontSize: hp(1.4),
    color: "#6B7280",
    marginLeft: wp(2),
    marginTop: hp(0.5),
  },
});

export default Recipe
