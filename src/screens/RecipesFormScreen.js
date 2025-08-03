import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onRecipeEdited } = route.params || {};
  const [title, setTitle] = useState(recipeToEdit ? recipeToEdit.title : "");
  const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : "");
  const [description, setDescription] = useState(
    recipeToEdit ? recipeToEdit.description : ""
  );

  const saveRecipe = async () => {
    // Basic validation
    if (!title.trim()) {
      Alert.alert("Title Required", "Please enter a recipe title");
      return;
    }
    
    if (!description.trim()) {
      Alert.alert("Description Required", "Please enter a recipe description");
      return;
    }

    try {
      // Create new recipe object
      const newRecipe = {
        id: recipeToEdit?.id || Date.now().toString(), // Use existing ID or generate new
        title: title.trim(),
        image: image.trim(),
        description: description.trim(),
        createdAt: recipeToEdit?.createdAt || new Date().toISOString(),
      };

      // Retrieve existing recipes
      const storedRecipes = await AsyncStorage.getItem("customRecipes");
      let recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

      if (recipeToEdit && recipeIndex !== undefined) {
        // Update existing recipe
        recipes[recipeIndex] = newRecipe;
        
        // Notify parent component about the edit
        if (onRecipeEdited) onRecipeEdited(newRecipe);
      } else {
        // Add new recipe
        recipes.push(newRecipe);
      }

      // Save updated recipes
      await AsyncStorage.setItem("customRecipes", JSON.stringify(recipes));
      
      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error("Error saving recipe:", error);
      Alert.alert("Error", "Failed to save recipe. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title*"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
      )}
      <TextInput
        placeholder="Description*"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, styles.descriptionInput]}
      />
      <TouchableOpacity onPress={saveRecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>
          {recipeToEdit ? "Update Recipe" : "Save Recipe"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: "white",
  },
  input: {
    marginTop: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(3),
    marginVertical: hp(1),
    borderRadius: 8,
    fontSize: hp(2),
  },
  descriptionInput: {
    height: hp(20),
    textAlignVertical: "top",
  },
  image: {
    width: "100%",
    height: hp(20),
    borderRadius: 8,
    marginVertical: hp(1),
    resizeMode: "cover",
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    padding: wp(2),
    borderRadius: 8,
    color: "#6B7280",
    fontSize: hp(2),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(4),
    alignItems: "center",
    borderRadius: 8,
    marginTop: hp(2),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: hp(2.2),
  },
});
