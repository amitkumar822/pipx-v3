import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ByCurrencyScreen from '@/src/components/screens/ByCurrencyScreen'
import HomeHeader from '@/src/components/helper/home/HomeHeader'
import { AppStatusBar } from '@/src/components/utils/AppStatusBar'

const Bycurrency = () => {
  const [showTab, setShowTab] = useState("By currency");
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, backgroundColor: "#FFF" }}>
      <AppStatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <HomeHeader showTab={showTab} setShowTab={setShowTab} />
      <>
        <ByCurrencyScreen showTab={showTab} setShowTab={setShowTab} />
      </>
    </SafeAreaView>
  )
}

export default Bycurrency