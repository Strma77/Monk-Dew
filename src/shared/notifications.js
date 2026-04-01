import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const isNative = Platform.OS !== 'web';

if (isNative) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });
}

export const requestPermissions = async () => {
    if (!isNative) return false;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
};

const scheduleDaily = async (id, hour, minute, title, body) => {
    await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
    await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: { title, body },
        trigger: { hour, minute, repeats: true },
    });
};

const scheduleWeekly = async (id, weekday, hour, minute, title, body) => {
    await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
    await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: { title, body },
        trigger: { weekday, hour, minute, repeats: true },
    });
};

// Sets up all fixed repeating notifications — safe to call on every app open
export const scheduleFixedNotifications = async () => {
    if (!isNative) return;
    await scheduleDaily('sleep-reminder', 10, 0,
        'Log your sleep',
        'How many hours did you sleep last night?'
    );
    await scheduleDaily('habits-checkin', 21, 30,
        'Day check-in',
        "Have you done everything today? Day's almost over."
    );
    await scheduleDaily('spend-reminder', 20, 0,
        'No-spend check',
        'Still a 0-spend day? Keep it that way.'
    );
    // weekday: 2 = Monday in expo-notifications
    await scheduleWeekly('weekly-reminder', 2, 9, 0,
        'Weekly goals',
        'New week. Where are you on your weekly goals?'
    );

    // Monthly: schedule a one-off for the next 1st — rescheduled every app open
    const now = new Date();
    const next1st = new Date(now.getFullYear(), now.getMonth() + 1, 1, 9, 0, 0, 0);
    await Notifications.cancelScheduledNotificationAsync('monthly-reminder').catch(() => {});
    await Notifications.scheduleNotificationAsync({
        identifier: 'monthly-reminder',
        content: {
            title: 'New month',
            body: "Time to set up this month's daily habits.",
        },
        trigger: { date: next1st },
    });
};

// Schedule a one-off 8am notification for tomorrow (missed daily goals)
export const scheduleMissedHabitsWarning = async () => {
    if (!isNative) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    await Notifications.cancelScheduledNotificationAsync('missed-habits').catch(() => {});
    await Notifications.scheduleNotificationAsync({
        identifier: 'missed-habits',
        content: {
            title: 'Missed goals',
            body: "You didn't complete all your daily goals yesterday. Don't let it become a pattern.",
        },
        trigger: { date: tomorrow },
    });
};

export const cancelMissedHabitsWarning = async () => {
    if (!isNative) return;
    await Notifications.cancelScheduledNotificationAsync('missed-habits').catch(() => {});
};

// Fired immediately after logging sleep outside the target range
export const notifySleepOutOfRange = () => {
    if (!isNative) return;
    Notifications.scheduleNotificationAsync({
        content: {
            title: 'Rough night',
            body: "Last night was outside your target range (7:30–9h). Focus on sleep tonight.",
        },
        trigger: null,
    });
};

// Fired when a streak hits a milestone
export const notifyStreakMilestone = (type, count) => {
    if (!isNative) return;
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    Notifications.scheduleNotificationAsync({
        content: {
            title: `${count}-${type === 'daily' ? 'day' : type === 'weekly' ? 'week' : 'month'} streak`,
            body: `${count} consecutive ${label} completions. Don't break it.`,
        },
        trigger: null,
    });
};

// Fired when balance first crosses a reward's cost
export const notifyBalanceThreshold = (rewardName, cost) => {
    if (!isNative) return;
    Notifications.scheduleNotificationAsync({
        content: {
            title: 'You can afford a reward',
            body: `${rewardName} costs ${cost} pts. Head to the store.`,
        },
        trigger: null,
    });
};

// Fired when consecutive misses hits 2 — one away from lockout
export const notifyLockoutWarning = () => {
    if (!isNative) return;
    Notifications.scheduleNotificationAsync({
        content: {
            title: 'Store lockout warning',
            body: 'Two consecutive misses. One more and the store locks for 24 hours.',
        },
        trigger: null,
    });
};
