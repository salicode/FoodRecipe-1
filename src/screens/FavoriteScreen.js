import React from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function FavoriteScreen() {
  const navigation = useNavigation();

  // Access favorite recipes from Redux store
  const favoriteRecipes = useSelector((state) => state.favorites);
  const favoriteRecipesList = favoriteRecipes?.favoriterecipes || [];

  // Render each recipe item
  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate("RecipeDetail", { ...item })}
    >
      <Image
        source={{ uri: item.recipeImage }}
        style={styles.recipeImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.recipeTitle}>{item.recipeName}</Text>
        <Text style={styles.recipeCategory}>{item.recipeCategory}</Text>
      </View>
    </TouchableOpacity>
  );

  if (favoriteRecipesList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorite recipes yet!</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBackButton}
        >
          <Text style={styles.goBackText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Heading */}
      <View testID="FavoriteRecipes">
        <Text style={styles.heading}>
          My Favorite Recipes
        </Text>
      </View>

      {/* Go Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.goBackButton}
      >
        <Text style={styles.goBackText}>Go back</Text>
      </TouchableOpacity>

      {/* Favorite Recipes List */}
      <FlatList
        data={favoriteRecipesList}
        keyExtractor={(item) => item.idFood}
        renderItem={renderRecipeItem}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  emptyText: {
    fontSize: hp(2.5),
    color: "#6B7280",
    marginBottom: hp(2),
  },
  heading: {
    fontSize: hp(3.8),
    fontWeight: "600",
    color: "#52525B",
    marginTop: hp(4),
    marginLeft: wp(5),
    marginBottom: hp(1),
  },
  goBackButton: {
    backgroundColor: "#2563EB",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: 8,
    marginLeft: wp(5),
    marginBottom: hp(2),
    alignSelf: 'flex-start',
  },
  goBackText: {
    color: "#fff",
    fontSize: hp(2),
    fontWeight: "500",
  },
  listContentContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  cardContainer: {
    backgroundColor: "white",
    marginBottom: hp(2),
    padding: wp(4),
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  recipeImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: wp(4),
  },
  recipeTitle: {
    fontSize: hp(2.2),
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: hp(0.5),
  },
  recipeCategory: {
    fontSize: hp(1.8),
    color: "#9CA3AF",
  },
});
