//import liraries
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import {addToDo, updateTodo} from '../../todoStore/reducer/todoReducer';
import styles from './style';
import {AppDispatch} from '../../todoStore/store';

let rand = function () {
  return Math.random().toString(36);
};

let token = function () {
  return rand() + rand();
};

const formatDate = (date: string | number | Date) => {
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month, year].join('-');
};

// create a component
const AddTodo = ({route: {params}}: any) => {
  const item = params?.item || null;
  const navigation = useNavigation();
  console.log('🚀 ~ file: index.tsx:22 ~ AddTodo ~ navigation:', navigation);

  const route = useRoute();
  console.log('🚀 ~ file: index.tsx:25 ~ AddTodo ~ route:', route);

  const {setOptions, pop} = useNavigation<any>();
  const [state, setState] = useState<any>({
    text: '',
    date: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (item) {
      setOptions({ title: 'Update Todo' });
      setState({
        ...item,
        date: formatDate(item.date) // Format the date
      });
      setSelectedDate(new Date(item.date)); // Set the initial date for the picker
    }
  }, [item]);


  const dispatch = useDispatch<AppDispatch>();
  const goback = () =>
    setTimeout(() => {
      pop();
    }, 100);

    const onDateChange = (event: any, selectedDate: Date) => {
      const currentDate = selectedDate || new Date(state.date);
      setShowDatePicker(Platform.OS === 'ios');
      setState({
        ...state,
        date: formatDate(currentDate) // Format the date before setting it
      });
      setSelectedDate(currentDate); // Update the selected date
    };
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const _addTodo = () => {
    if (!state.text) {
      Alert.alert('Please enter your text');
    } else if (!state.date) {
      Alert.alert('Please enter your date');
    } else {
      dispatch(addToDo({...state, isCompleted: false, id: token()}));
      goback();
    }
  };

  const _updateTodo = () => {
    if (!state.text) {
      Alert.alert('Please enter your text');
    } else if (!state.date) {
      Alert.alert('Please enter your date');
    } else {
      dispatch(updateTodo(state));
      goback();
    }
  };
  return (
    
    <View style={styles.container}>
      <View style={styles.contentContainerStyle}>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Label</Text>
            <TextInput
              value={state.text}
              onChangeText={(text: string) =>
                setState({
                  ...state,
                  text,
                })
              }
              placeholder="Enter the text"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
          {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity onPress={showDatepicker}>
              <TextInput
                value={state.date}
                editable={false} // Makes the text input non-editable
                placeholder="DD-MM-YYYY"
                style={styles.input}
              />
            </TouchableOpacity>
           
          </View>
          
          

          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => (item ? _updateTodo() : _addTodo())}>
              <View style={styles.btn}>
                <Text style={styles.label}>
                  {item ? `Update Task` : `Add Task`}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
    </View>
  );
};

//make this component available to the app
export default AddTodo;
