import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useState } from "react";

const SleepInput = ({ onSubmit }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    const handleSubmit = () => {
        onSubmit(date, parseInt(hours), parseInt(minutes));
        setHours('');
        setMinutes('');
    }

    return (
        //View > inputs + button
        <View>
            <TextInput keyboardType="numeric" onChangeText={setHours} value={hours}>

            </TextInput>
            <TextInput keyboardType="numeric" onChangeText={setMinutes} value={minutes}>

            </TextInput>
            <TouchableOpacity onPress={handleSubmit}>
                <Text>Save</Text>
            </TouchableOpacity>
        </View>
    );
}

export default SleepInput;