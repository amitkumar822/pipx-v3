import { TextInput, StyleSheet, View } from "react-native";
import React from "react";

const TextField = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  editable = true,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        secureTextEntry={secureTextEntry}
        editable={editable}
        importantForAutofill="no"
      />
    </View>
  );
};

export default TextField;

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderRadius: 8,
    borderColor: "#007AFF",
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
});
