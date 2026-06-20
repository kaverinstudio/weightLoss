import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import DayResultCard from '@/components/DayResultCard';
import DaySummaryCard from '@/components/DaySummaryCard';
import MealsList from '@/components/MealsList';
import NextActionButton from '@/components/NextActionButton';
import { AppleTheme } from '@/constants/appleTheme';

export default function HomeScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <DaySummaryCard />

            <MealsList />

            <Pressable
                style={styles.button}
                onPress={() => router.push('/add-meal')}
            >
                <Ionicons name="add-circle" size={21} color="#FFFFFF" />
                <Text style={styles.buttonText}>Добавить приём пищи</Text>
            </Pressable>

            <DayResultCard />

            <NextActionButton />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingTop: 56,
        paddingBottom: 40,
        backgroundColor: AppleTheme.background,
        flexGrow: 1,
    },
    button: {
        backgroundColor: AppleTheme.darkButton,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
