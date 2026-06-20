import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useAppDispatch } from '@/store/hooks';
import {
    ActivityLevel,
    GoalType,
    setActivity,
    setGoal,
    setUserData,
} from '@/store/userSlice';
import { AppleTheme } from '@/constants/appleTheme';

const goals: { label: string; description: string; value: GoalType }[] = [
    {
        label: 'Снизить вес на 3-5 кг',
        description: 'Мягкий темп без резких ограничений',
        value: 'lose_3_5',
    },
    {
        label: 'Снизить вес на 6-8 кг',
        description: 'Более заметная цель с регулярным контролем',
        value: 'lose_6_8',
    },
    {
        label: 'Поддерживать текущий вес',
        description: 'Стабильное питание без дефицита',
        value: 'maintain',
    },
];

const activities: { label: string; description: string; value: ActivityLevel }[] = [
    {
        label: 'Минимальная',
        description: 'Дом, работа, почти без прогулок',
        value: 'minimal',
    },
    {
        label: 'Низкая',
        description: 'Иногда гуляю и двигаюсь в течение дня',
        value: 'low',
    },
    {
        label: 'Средняя',
        description: 'Регулярные прогулки и активные дела',
        value: 'medium',
    },
];

export default function GoalScreen() {
    const dispatch = useAppDispatch();
    const [goal, setSelectedGoal] = useState<GoalType | null>(null);
    const [activity, setSelectedActivity] = useState<ActivityLevel | null>(null);
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    const isValid =
        goal &&
        activity &&
        Number(age) > 0 &&
        Number(height) > 0 &&
        Number(weight) > 0;

    function handleNext() {
        if (!isValid || !goal || !activity) return;

        dispatch(setGoal(goal));
        dispatch(setActivity(activity));
        dispatch(
            setUserData({
                age: Number(age),
                height: Number(height),
                weight: Number(weight),
            })
        );

        router.push('/onboarding/result');
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboard}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <View>
                        <Text style={styles.title}>Настроим дневную норму</Text>
                        <Text style={styles.subtitle}>
                            Выберите цель, активность и введите данные для расчета.
                        </Text>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Цель</Text>
                            {goals.map(item => {
                                const selected = goal === item.value;

                                return (
                                    <Pressable
                                        key={item.value}
                                        style={[styles.option, selected && styles.optionSelected]}
                                        onPress={() => setSelectedGoal(item.value)}
                                    >
                                        <View style={styles.optionTextWrap}>
                                            <Text style={styles.optionTitle}>{item.label}</Text>
                                            <Text style={styles.optionDescription}>
                                                {item.description}
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                                            size={24}
                                            color={selected ? AppleTheme.accent : AppleTheme.tertiaryText}
                                        />
                                    </Pressable>
                                );
                            })}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Активность</Text>
                            {activities.map(item => {
                                const selected = activity === item.value;

                                return (
                                    <Pressable
                                        key={item.value}
                                        style={[styles.option, selected && styles.optionSelected]}
                                        onPress={() => setSelectedActivity(item.value)}
                                    >
                                        <View style={styles.optionTextWrap}>
                                            <Text style={styles.optionTitle}>{item.label}</Text>
                                            <Text style={styles.optionDescription}>
                                                {item.description}
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                                            size={24}
                                            color={selected ? AppleTheme.accent : AppleTheme.tertiaryText}
                                        />
                                    </Pressable>
                                );
                            })}
                        </View>

                        <View style={styles.formCard}>
                            <Text style={styles.sectionTitle}>Данные</Text>
                            <View style={styles.inputGrid}>
                                <View style={styles.inputBlock}>
                                    <Text style={styles.label}>Возраст</Text>
                                    <TextInput
                                        value={age}
                                        onChangeText={setAge}
                                        keyboardType="numeric"
                                        placeholder="42"
                                        placeholderTextColor={AppleTheme.tertiaryText}
                                        style={styles.input}
                                    />
                                </View>
                                <View style={styles.inputBlock}>
                                    <Text style={styles.label}>Рост</Text>
                                    <TextInput
                                        value={height}
                                        onChangeText={setHeight}
                                        keyboardType="numeric"
                                        placeholder="165"
                                        placeholderTextColor={AppleTheme.tertiaryText}
                                        style={styles.input}
                                    />
                                </View>
                                <View style={styles.inputBlock}>
                                    <Text style={styles.label}>Вес</Text>
                                    <TextInput
                                        value={weight}
                                        onChangeText={setWeight}
                                        keyboardType="numeric"
                                        placeholder="78"
                                        placeholderTextColor={AppleTheme.tertiaryText}
                                        style={styles.input}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <Pressable
                        style={[styles.button, !isValid && styles.buttonDisabled]}
                        disabled={!isValid}
                        onPress={handleNext}
                    >
                        <Text style={styles.buttonText}>Рассчитать норму</Text>
                    </Pressable>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboard: {
        flex: 1,
        backgroundColor: AppleTheme.background,
    },
    container: {
        padding: 24,
        paddingTop: 56,
        paddingBottom: 40,
        backgroundColor: AppleTheme.background,
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 32,
        lineHeight: 38,
        fontWeight: '800',
        color: AppleTheme.text,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: AppleTheme.secondaryText,
        marginTop: 8,
        marginBottom: 24,
    },
    section: {
        gap: 10,
        marginBottom: 22,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: AppleTheme.text,
        marginBottom: 2,
    },
    option: {
        backgroundColor: AppleTheme.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'transparent',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        ...AppleTheme.shadow,
    },
    optionSelected: {
        borderColor: AppleTheme.accent,
        backgroundColor: AppleTheme.accentSoft,
    },
    optionTextWrap: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: AppleTheme.text,
        marginBottom: 3,
    },
    optionDescription: {
        fontSize: 13,
        lineHeight: 18,
        color: AppleTheme.secondaryText,
    },
    formCard: {
        backgroundColor: AppleTheme.card,
        borderRadius: 20,
        padding: 18,
        marginBottom: 24,
        ...AppleTheme.shadow,
    },
    inputGrid: {
        gap: 12,
        marginTop: 12,
    },
    inputBlock: {
        gap: 7,
    },
    label: {
        fontSize: 13,
        color: AppleTheme.secondaryText,
        fontWeight: '700',
    },
    input: {
        backgroundColor: AppleTheme.background,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: AppleTheme.text,
    },
    button: {
        backgroundColor: AppleTheme.darkButton,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: AppleTheme.disabled,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
});
