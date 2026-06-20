import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppleTheme } from '@/constants/appleTheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProfile } from '@/store/userSlice';

type ImagePickerModule = typeof import('expo-image-picker');

const goalLabels = {
    lose_3_5: 'Снизить на 3-5 кг',
    lose_6_8: 'Снизить на 6-8 кг',
    maintain: 'Поддерживать вес',
};

const activityLabels = {
    minimal: 'Минимальная',
    low: 'Низкая',
    medium: 'Средняя',
};

const nativeModuleMissingText = 'Cannot find native module';

const showRebuildAlert = () => {
    Alert.alert(
        'Нужно пересобрать приложение',
        'Модуль выбора фото установлен, но ещё не встроен в dev-сборку. Запустите npx expo run:android и откройте приложение заново.'
    );
};

const getImagePicker = async (): Promise<ImagePickerModule | null> => {
    try {
        const module = await import('expo-image-picker');
        return (module.default ?? module) as ImagePickerModule;
    } catch (error) {
        const message = error instanceof Error ? error.message : '';

        if (message.includes(nativeModuleMissingText)) {
            showRebuildAlert();
        }

        return null;
    }
};

export default function ProfileScreen() {
    const dispatch = useAppDispatch();
    const {
        age,
        height,
        weight,
        targetCalories,
        goal,
        activity,
        nickname,
        avatarUri,
    } = useAppSelector(state => state.user);
    const [draftNickname, setDraftNickname] = useState(nickname ?? '');
    const [draftAvatarUri, setDraftAvatarUri] = useState<string | null>(avatarUri);

    useEffect(() => {
        setDraftNickname(nickname ?? '');
        setDraftAvatarUri(avatarUri);
    }, [nickname, avatarUri]);

    const rows = [
        { label: 'Возраст', value: age ? `${age}` : '-' },
        { label: 'Рост', value: height ? `${height} см` : '-' },
        { label: 'Вес', value: weight ? `${weight} кг` : '-' },
        { label: 'Активность', value: activity ? activityLabels[activity] : '-' },
        { label: 'Цель', value: goal ? goalLabels[goal] : '-' },
        { label: 'Норма', value: targetCalories ? `${targetCalories} ккал` : '-' },
    ];

    const hasChanges =
        draftNickname.trim() !== (nickname ?? '') ||
        draftAvatarUri !== avatarUri;

    async function pickAvatar() {
        const ImagePicker = await getImagePicker();

        if (!ImagePicker?.launchImageLibraryAsync) {
            showRebuildAlert();
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setDraftAvatarUri(result.assets[0].uri);
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Не удалось открыть галерею.';

            if (message.includes(nativeModuleMissingText)) {
                showRebuildAlert();
                return;
            }

            Alert.alert('Не удалось выбрать фото', message);
        }
    }

    function handleSave() {
        dispatch(setProfile({
            nickname: draftNickname,
            avatarUri: draftAvatarUri,
        }));
    }

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Профиль</Text>

            <View style={styles.profileCard}>
                <Pressable style={styles.avatarWrap} onPress={pickAvatar}>
                    {draftAvatarUri ? (
                        <Image source={{ uri: draftAvatarUri }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons
                                name="person"
                                size={40}
                                color={AppleTheme.tertiaryText}
                            />
                        </View>
                    )}
                    <View style={styles.cameraBadge}>
                        <Ionicons name="camera" size={16} color="#FFFFFF" />
                    </View>
                </Pressable>

                <View style={styles.nameBlock}>
                    <Text style={styles.inputLabel}>Никнейм</Text>
                    <TextInput
                        value={draftNickname}
                        onChangeText={setDraftNickname}
                        placeholder="Как вас называть?"
                        placeholderTextColor={AppleTheme.tertiaryText}
                        style={styles.nicknameInput}
                    />
                </View>

                <Pressable
                    style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
                    disabled={!hasChanges}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>
                        {hasChanges ? 'Сохранить профиль' : 'Профиль сохранён'}
                    </Text>
                </Pressable>
            </View>

            <View style={styles.heroCard}>
                <View style={styles.heroIcon}>
                    <Ionicons name="flame-outline" size={28} color={AppleTheme.accentText} />
                </View>
                <View>
                    <Text style={styles.heroLabel}>Дневная норма</Text>
                    <Text style={styles.heroValue}>
                        {targetCalories ? `${targetCalories} ккал` : 'Не рассчитана'}
                    </Text>
                </View>
            </View>

            <View style={styles.card}>
                {rows.map(row => (
                    <View key={row.label} style={styles.row}>
                        <Text style={styles.label}>{row.label}</Text>
                        <Text style={styles.value}>{row.value}</Text>
                    </View>
                ))}
            </View>
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
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: AppleTheme.text,
        marginBottom: 18,
    },
    profileCard: {
        backgroundColor: AppleTheme.card,
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        marginBottom: 16,
        ...AppleTheme.shadow,
    },
    avatarWrap: {
        width: 104,
        height: 104,
        marginBottom: 16,
    },
    avatar: {
        width: 104,
        height: 104,
        borderRadius: 34,
    },
    avatarPlaceholder: {
        width: 104,
        height: 104,
        borderRadius: 34,
        backgroundColor: AppleTheme.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraBadge: {
        position: 'absolute',
        right: -2,
        bottom: -2,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: AppleTheme.darkButton,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: AppleTheme.card,
    },
    nameBlock: {
        width: '100%',
        gap: 8,
    },
    inputLabel: {
        fontSize: 13,
        color: AppleTheme.secondaryText,
        fontWeight: '800',
    },
    nicknameInput: {
        backgroundColor: AppleTheme.background,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: AppleTheme.text,
        fontWeight: '700',
    },
    saveButton: {
        width: '100%',
        marginTop: 14,
        backgroundColor: AppleTheme.darkButton,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: AppleTheme.disabled,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },
    heroCard: {
        backgroundColor: AppleTheme.accentSoft,
        borderRadius: 22,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
        ...AppleTheme.shadow,
    },
    heroIcon: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: AppleTheme.card,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: AppleTheme.accentText,
        marginBottom: 3,
    },
    heroValue: {
        fontSize: 24,
        fontWeight: '800',
        color: AppleTheme.text,
    },
    card: {
        backgroundColor: AppleTheme.card,
        borderRadius: 20,
        padding: 18,
        gap: 16,
        ...AppleTheme.shadow,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    label: {
        fontSize: 14,
        color: AppleTheme.secondaryText,
        fontWeight: '600',
    },
    value: {
        fontSize: 14,
        color: AppleTheme.text,
        fontWeight: '800',
        textAlign: 'right',
        flexShrink: 1,
    },
});
