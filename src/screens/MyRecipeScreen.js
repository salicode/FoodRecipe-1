
  
  import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function MyRecipeScreen() {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem("customRecipes");
        if (storedRecipes) {
          setRecipes(JSON.parse(storedRecipes));
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleAddRecipe = () => {
    navigation.navigate("RecipesFormScreen");
  };

  const handleRecipeClick = (recipe) => {
    navigation.navigate("CustomRecipesScreen", { recipe });
  };

  const deleteRecipe = async (index) => {
    try {
      const updatedRecipes = [...recipes];
      updatedRecipes.splice(index, 1);
      setRecipes(updatedRecipes);
      await AsyncStorage.setItem("customRecipes", JSON.stringify(updatedRecipes));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const editRecipe = (recipe, index) => {
    navigation.navigate("RecipesFormScreen", { 
      recipeToEdit: recipe,
      recipeIndex: index,
      onRecipeEdited: (updatedRecipe) => {
        const updatedRecipes = [...recipes];
        updatedRecipes[index] = updatedRecipe;
        setRecipes(updatedRecipes);
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAddRecipe} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Recipe</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4F75FF" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {recipes.length === 0 ? (
            <Text style={styles.noRecipesText}>No recipes added yet.</Text>
          ) : (
            recipes.map((recipe, index) => (
              <View key={index} style={styles.recipeCard} testID="recipeCard">
                <TouchableOpacity 
                  testID="handleRecipeBtn" 
                  onPress={() => handleRecipeClick(recipe)}
                >
                  {recipe.image ? (
                    <Image 
                      source={{ uri: recipe.image }} 
                      style={styles.recipeImage} 
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text>No Image</Text>
                    </View>
                  )}
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text style={styles.recipeDescription} testID="recipeDescp">
                    {recipe.description 
                      ? `${recipe.description.substring(0, 50)}...`
                      : "No description available"}
                  </Text>
                </TouchableOpacity>

                {/* Edit and Delete Buttons */}
                <View style={styles.actionButtonsContainer} testID="editDeleteButtons">
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => editRecipe(recipe, index)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteRecipe(index)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: "#F9FAFB",
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backButton: {
    marginBottom: hp(1.5),
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: hp(2.2),
    color: "#4F75FF",
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: "#4F75FF",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    alignItems: "center",
    borderRadius: 8,
    marginBottom: hp(2),
    alignSelf: 'center',
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(2.2),
  },
  scrollContainer: {
    paddingBottom: hp(2),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: wp(4),
  },
  noRecipesText: {
    textAlign: "center",
    fontSize: hp(2.5),
    color: "#6B7280",
    marginTop: hp(5),
  },
  recipeCard: {
    width: wp(45),
    backgroundColor: "#fff",
    padding: wp(3),
    borderRadius: 12,
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: hp(20),
    borderRadius: 8,
    marginBottom: hp(1),
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: hp(20),
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: hp(2.3),
    fontWeight: "600",
    color: "#111827",
    marginBottom: hp(0.5),
  },
  recipeDescription: {
    fontSize: hp(1.9),
    color: "#6B7280",
    marginBottom: hp(1.5),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(0.5),
  },
  editButton: {
    backgroundColor: "#34D399",
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: 6,
    flex: 1,
    marginRight: wp(1),
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(1.8),
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: 6,
    flex: 1,
    marginLeft: wp(1),
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(1.8),
  },
});