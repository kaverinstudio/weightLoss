import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppleTheme } from '@/constants/appleTheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeMeal, type Meal } from '@/store/userSlice';

const MealsList = () => {
    const { meals } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const editMeal = (meal: Meal) => {
        router.push({
            pathname: '/add-meal',
            params: { id: meal.id },
        });
    };

    const openMenu = (meal: Meal) => {
        Alert.alert('Приём пищи', 'Выберите действие', [
            {
                text: 'Редактировать',
                onPress: () => editMeal(meal),
            },
            {
                text: 'Удалить',
                style: 'destructive',
                onPress: () => dispatch(removeMeal(meal.id)),
            },
            { text: 'Отмена', style: 'cancel' },
        ]);
    };

    return (
        <View style={styles.meals}>
            {meals.length === 0 ? (
                <View style={styles.emptyCard}>
                    <Ionicons
                        name="restaurant-outline"
                        size={22}
                        color={AppleTheme.tertiaryText}
                    />
                    <Text style={styles.empty}>
                        Сегодня вы ещё ничего не добавили
                    </Text>
                </View>
            ) : (
                meals.map(meal => (
                    <Pressable
                        key={meal.id}
                        onPress={() => editMeal(meal)}
                        onLongPress={() => openMenu(meal)}
                        delayLongPress={400}
                        style={({ pressed }) => [
                            styles.mealItem,
                            pressed && styles.mealItemPressed,
                        ]}
                    >
                        <View style={styles.mealText}>
                            <Text style={styles.mealTitle}>{meal.title}</Text>
                            <Text style={styles.mealCalories}>
                                {meal.calories} ккал
                            </Text>
                        </View>

                        <Pressable
                            onPress={event => {
                                event.stopPropagation();
                                openMenu(meal);
                            }}
                            hitSlop={10}
                            style={styles.menuButton}
                        >
                            <Ionicons
                                name="ellipsis-horizontal-circle"
                                size={24}
                                color={AppleTheme.tertiaryText}
                            />
                        </Pressable>
                    </Pressable>
                ))
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    meals: {
        gap: 10,
        marginBottom: 18,
    },
    emptyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: AppleTheme.card,
        borderRadius: 18,
        padding: 16,
        ...AppleTheme.shadow,
    },
    empty: {
        color: AppleTheme.secondaryText,
        fontSize: 15,
        lineHeight: 21,
        flex: 1,
    },
    mealItem: {
        backgroundColor: AppleTheme.card,
        borderRadius: 18,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        ...AppleTheme.shadow,
    },
    mealItemPressed: {
        opacity: 0.72,
    },
    mealText: {
        flex: 1,
    },
    mealTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: AppleTheme.text,
    },
    mealCalories: {
        fontSize: 13,
        color: AppleTheme.secondaryText,
        marginTop: 4,
    },
    menuButton: {
        padding: 2,
    },
});

export default MealsList;
