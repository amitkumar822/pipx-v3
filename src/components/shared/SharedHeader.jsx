import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useCallback, useMemo, memo } from "react";
import { useRouter, usePathname } from "expo-router";

const SharedHeader = memo(() => {
    const router = useRouter();
    const pathname = usePathname();

    const labels = [
        "Agent Signals",
        "By currency",
        // "Agent",
    ];

    // Memoize the current active tab based on pathname
    const currentTab = useMemo(() => {
        if (pathname === "/") return "Agent Signals";
        if (pathname === "/by-currency") return "By currency";
        // if (pathname === "/agent") return "Agent";
        return "Agent Signals";
    }, [pathname]);

    // Memoize the navigation handler to prevent recreation
    const handlePress = useCallback((label) => {
        switch (label) {
            case "Agent Signals":
                if (pathname !== "/") {
                    router.push("/");
                }
                break;
            case "By currency":
                if (pathname !== "/by-currency") {
                    router.push("/by-currency");
                }
                break;
            // case "Agent":
            //     if (pathname !== "/agent") {
            //         router.push("/agent");
            //     }
            //     break;
            default:
                console.log("Unhandled press:", label);
        }
    }, [router, pathname]);

    return (
        <>
            <View
                className="bg-[#FFFFFF] pb-2 border-indigo-200"
                style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#E0E0E0",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.84,
                }}
            >
                <Pressable onPress={() => router.push("/")}>
                    <Text
                        className="font-extrabold text-black"
                        style={{
                            fontSize: 25,
                        }}
                    >
                        PipX
                    </Text>
                </Pressable>
            </View>

            <View className="flex-row flex-wrap gap-2 py-2 bg-white">
                {labels.map((label, index) => {
                    const isActive = currentTab === label;

                    return (
                        <TouchableOpacity key={index} onPress={() => handlePress(label)}>
                            <Text
                                className={`text-center px-4 py-2 rounded-xl font-semibold bg-[#EBF5FF] ${isActive ? "text-[#2E75FF]" : " text-[#50555C]"
                                    }`}
                                style={{ fontSize: 13 }}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </>
    );
});

SharedHeader.displayName = 'SharedHeader';

export default SharedHeader;
