import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
    const [startDate, setStartDate] = useState(null);
    const [daysCount, setDaysCount] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const fetchStartDate = async () => {
            try {
                const storedDate = await AsyncStorage.getItem('@startDate');
                if (storedDate) {
                    const date = new Date(storedDate);
                    setStartDate(date);
                    calculateDays(date);
                }
            } catch (error) {
                console.error('Failed to load start date:', error);
            }
        };
        fetchStartDate();
    }, []);

    const saveStartDate = async (date) => {
        try {
            await AsyncStorage.setItem('@startDate', date.toISOString());
            setStartDate(date);
            calculateDays(date);
        } catch (error) {
            console.error('Failed to save start date:', error);
        }
    };

    const calculateDays = (date) => {
        const start = new Date(date);
        const today = new Date();
        // Reset time for accurate day difference
        start.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffTime = today - start;
        const diffDays = Math.abs(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
        setDaysCount(diffDays);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowDatePicker(Platform.OS === 'ios');
        if (currentDate) {
            saveStartDate(currentDate);
        }
    };

    const handleReset = () => {
        AsyncStorage.removeItem('@startDate')
            .then(() => {
                setStartDate(null);
                setDaysCount(0);
            })
            .catch((error) => {
                console.error('Failed to reset start date:', error);
            });
    };

    return (
        <ImageBackground source={require('./assets/background.jpg')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.title}>Day Counter App</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateText}>
                        {startDate ? startDate.toDateString() : 'Select Date to Count'}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={startDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )}
                <View style={styles.circleContainer}>
                    <Text style={styles.daysCount}>{daysCount}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleReset}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    dateText: {
        height: 50,
        fontSize: 18,
        color: '#333',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: '80%',
    },
    circleContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#007BFF',
        marginBottom: 30,
    },
    daysCount: {
        fontSize: 24,
        fontWeight: '500',
        color: '#fff',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },
});

export default App;
