import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AgentScreen from '@/src/components/screens/AgentScreen'
import { AppStatusBar } from '@/src/components/utils/AppStatusBar'
import HomeHeader from '@/src/components/helper/home/HomeHeader'

const Agent = () => {
  const [showTab, setShowTab] = useState("Agent");
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, backgroundColor: "#FFF" }}>
      <AppStatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <HomeHeader showTab={showTab} setShowTab={setShowTab} />
      <>
        <AgentScreen />
      </>
    </SafeAreaView>
  )
}

export default Agent