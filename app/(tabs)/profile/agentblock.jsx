import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { UserFollowingScreen } from '@/src/components/screens/UserFollowingScreen'

const AgentBlock = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <UserFollowingScreen boxType="blocked" blockedUserType="agent" />
    </SafeAreaView>
  )
}

export default AgentBlock