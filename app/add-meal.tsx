import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppleTheme } from '@/constants/appleTheme';
import { RootState } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { addMeal, updateMeal } from '@/store/userSlice';

export default function AddMealScreen() {
    const dispatch = useAppDispatch();
    const { id } = useLocalSearchParams();
    const meal = useSelector((state: RootState) =>
        state.user.meals.find(item => item.id === id)
    );

    const [title, setTitle] = useState('');
    const [calories, setCalories] = useState('');
    const isValid = title.trim().length > 0 && Number(calories) > 0;

    useEffect(() => {
        if (meal) {
            setTitle(meal.title);
            setCalories(String(meal.calories));
        }
    }, [meal]);

    function handleSave() {
        if (!isValid) return;

        if (meal) {
            dispatch(updateMeal({
                id: meal.id,
                title: title.trim(),
                calories: Number(calories),
            }));
        } else {
            dispatch(addMeal({
                id: Date.now().toString(),
                title: title.trim(),
                calories: Number(calories),
            }));
        }

        router.back();
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboard}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View>
                        <Pressable style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={18} color={AppleTheme.accentText} />
                            <Text style={styles.backText}>Назад</Text>
                        </Pressable>

                        <Text style={styles.title}>
                            {meal ? 'Редактировать приём пищи' : 'Добавить приём пищи'}
                        </Text>

                        <View style={styles.form}>
                            <Text style={styles.label}>Название</Text>
                            <TextInput
                                placeholder="Например: домашний борщ"
                                placeholderTextColor={AppleTheme.tertiaryText}
                                value={title}
                                onChangeText={setTitle}
                                style={styles.input}
                            />

                            <Text style={styles.label}>Калории</Text>
                            <TextInput
                                placeholder="320"
                                placeholderTextColor={AppleTheme.tertiaryText}
                                value={calories}
                                onChangeText={setCalories}
                                keyboardType="numeric"
                                style={styles.input}
                            />
                        </View>
                    </View>

                    <Pressable
                        style={[styles.button, !isValid && styles.buttonDisabled]}
                        disabled={!isValid}
                        onPress={handleSave}
                    >
                        <Ionicons name="checkmark-circle" size={21} color="#FFFFFF" />
                        <Text style={styles.buttonText}>
                            {meal ? 'Сохранить' : 'Добавить'}
                        </Text>
                    </Pressable>
                </View>
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
        flex: 1,
        padding: 24,
        paddingTop: 56,
        justifyContent: 'space-between',
        backgroundColor: AppleTheme.background,
    },
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: AppleTheme.card,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginBottom: 18,
        ...AppleTheme.shadow,
    },
    backText: {
        color: AppleTheme.accentText,
        fontSize: 14,
        fontWeight: '800',
    },
    title: {
        fontSize: 30,
        lineHeight: 36,
        fontWeight: '800',
        color: AppleTheme.text,
    },
    form: {
        gap: 10,
        marginTop: 28,
        backgroundColor: AppleTheme.card,
        borderRadius: 20,
        padding: 16,
        ...AppleTheme.shadow,
    },
    label: {
        fontSize: 13,
        color: AppleTheme.secondaryText,
        fontWeight: '800',
        marginTop: 4,
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
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 32,
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
