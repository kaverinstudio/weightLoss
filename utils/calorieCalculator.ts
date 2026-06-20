type ActivityLevel = 'minimal' | 'low' | 'medium';

interface UserData {
    age: number;
    height: number; // cm
    weight: number; // kg
    activity: ActivityLevel;
}

const activityFactorMap: Record<ActivityLevel, number> = {
    minimal: 1.2,
    low: 1.35,
    medium: 1.5,
};

export function calculateCalories(user: UserData) {
    const { age, height, weight, activity } = user;

    const bmr =
        10 * weight +
        6.25 * height -
        5 * age -
        161;

    const tdee = bmr * activityFactorMap[activity];

    const adjustedTdee = tdee * 0.95; // коррекция 40+

    const deficit = 350; // базовый дефицит
    const targetCalories = Math.max(adjustedTdee - deficit, 1200);

    return Math.round(targetCalories);
}
