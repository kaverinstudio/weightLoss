import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { calculateCalories } from '../utils/calorieCalculator';
import { getLocalDateKey } from '@/utils/date';

export type ActivityLevel = 'minimal' | 'low' | 'medium';
export type GoalType = 'lose_3_5' | 'lose_6_8' | 'maintain';

export type Meal = {
    id: string;
    title: string;
    calories: number;
};

export interface UserState {
    nickname: string | null;
    avatarUri: string | null;
    age: number | null;
    height: number | null;
    weight: number | null;
    activity: ActivityLevel | null;
    targetCalories: number | null;
    goal: GoalType | null;
    meals: Meal[];

    history: DayHistory[];
    currentDate: string;

    daySaved: boolean;

}

type SetUserDataPayload = {
    age: number;
    height: number;
    weight: number;
};

export type DayHistory = {
    date: string; // '2026-01-15'
    meals: Meal[];
    totalCalories: number;
    targetCalories: number;
    diff: number;
};
const today = getLocalDateKey();


const initialState: UserState = {
    nickname: null,
    avatarUri: null,
    age: null,
    height: null,
    weight: null,
    activity: null,
    targetCalories: null,
    goal: null,
    meals: [],

    history: [],
    currentDate: today,

    daySaved: false,
};

const getTodayDate = getLocalDateKey;

const buildDayHistory = (
    date: string,
    meals: Meal[],
    targetCalories: number | null
): DayHistory => {
    const totalCalories = meals.reduce(
        (sum, meal) => sum + meal.calories,
        0
    );
    const normalizedTargetCalories = targetCalories ?? 0;

    return {
        date,
        meals: meals.map(meal => ({ ...meal })),
        totalCalories,
        targetCalories: normalizedTargetCalories,
        diff: normalizedTargetCalories - totalCalories,
    };
};

const upsertHistoryDay = (history: DayHistory[], dayData: DayHistory) => {
    const index = history.findIndex(day => day.date === dayData.date);

    if (index >= 0) {
        history[index] = dayData;
    } else {
        history.unshift(dayData);
    }
};

const normalizeHistory = (history: DayHistory[]) => {
    const daysByDate = new Map<string, DayHistory>();

    history.forEach(day => {
        if (!daysByDate.has(day.date)) {
            daysByDate.set(day.date, day);
        }
    });

    return Array.from(daysByDate.values()).sort((a, b) =>
        b.date.localeCompare(a.date)
    );
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData(
            state,
            action: PayloadAction<SetUserDataPayload>
        ) {
            state.age = action.payload.age;
            state.height = action.payload.height;
            state.weight = action.payload.weight;

            if (state.activity) {
                state.targetCalories = calculateCalories({
                    age: action.payload.age,
                    height: action.payload.height,
                    weight: action.payload.weight,
                    activity: state.activity,
                });
            }
        },

        setProfile(
            state,
            action: PayloadAction<{ nickname: string; avatarUri: string | null }>
        ) {
            state.nickname = action.payload.nickname.trim();
            state.avatarUri = action.payload.avatarUri;
        },

        setActivity(state, action: PayloadAction<ActivityLevel>) {
            state.activity = action.payload;
        },

        calculateTargetCalories(state, action: PayloadAction<number>) {
            if (
                state.age &&
                state.height &&
                state.weight &&
                state.activity
            ) {
                state.targetCalories = calculateCalories({
                    age: state.age,
                    height: state.height,
                    weight: state.weight,
                    activity: state.activity,
                });
            }
        },

        updateWeight(state, action: PayloadAction<number>) {
            state.weight = action.payload;
        },
        setGoal(state, action: PayloadAction<GoalType>) {
            state.goal = action.payload;
        },
        addMeal(state, action: PayloadAction<Meal>) {
            state.meals.push(action.payload);
            state.daySaved = false;
        },
        removeMeal(state, action) {
            state.meals = state.meals.filter(
                meal => meal.id !== action.payload
            );
            state.daySaved = false;
        },
        updateMeal(
            state,
            action: PayloadAction<{ id: string; title: string; calories: number }>
        ) {
            const meal = state.meals.find(m => m.id === action.payload.id);
            if (meal) {
                meal.title = action.payload.title;
                meal.calories = action.payload.calories;
            }
            state.daySaved = false;
        },
        finishDay(state) {
            const today = getTodayDate();

            upsertHistoryDay(
                state.history,
                buildDayHistory(today, state.meals, state.targetCalories)
            );

            state.daySaved = true;
            state.currentDate = today;
        },
        checkNewDay(state) {
            const today = getTodayDate();

            state.history = normalizeHistory(state.history);

            if (state.currentDate !== today) {
                // ❗ СОХРАНЯЕМ СТАРЫЙ ДЕНЬ ПЕРЕД ОЧИСТКОЙ
                if (state.meals.length > 0) {
                    upsertHistoryDay(
                        state.history,
                        buildDayHistory(state.currentDate, state.meals, state.targetCalories)
                    );
                }

                state.meals = [];
                state.daySaved = false;
                state.currentDate = today;
            }
        }

    },
});

export const {
    setUserData,
    setProfile,
    setActivity,
    setGoal,
    calculateTargetCalories,
    updateWeight,
    updateMeal,
    addMeal,
    removeMeal,
    finishDay,
    checkNewDay
} = userSlice.actions;


export default userSlice.reducer;
