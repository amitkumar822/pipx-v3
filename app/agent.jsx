import React from 'react'
import AgentScreen from '@/src/components/screens/AgentScreen'
import { View, Pressable, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppStatusBar } from '@/src/components/utils/AppStatusBar'
import { router, useLocalSearchParams } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'

const Agent = () => {
  const { currencyAssetId } = useLocalSearchParams();
  return (
    <SafeAreaView style={styles.container}>
      <AppStatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <View style={styles.headercontainer}>
        <Pressable style={styles.backbtn} onPress={() => router.push("/by-currency")}>
          <View style={styles.backbtn}>
            <Ionicons name="chevron-back-outline" size={24} color="#007AFF" />
            <Text style={styles.backTxt}>Back</Text>
          </View>
        </Pressable>
      </View>

      <>
        <AgentScreen assetId={currencyAssetId} />
      </>
    </SafeAreaView>
  )
}

export default Agent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  headercontainer: {
    width: "100%",
    height: 35,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  backbtn: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 0,
  },
  backTxt: {
    color: "#007AFF",
    fontSize: 17,
    fontWeight: "500",
  },
});