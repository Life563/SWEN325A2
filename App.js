import React, {Component} from 'react';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';
import {Text, TextInput, View, FlatList, TouchableOpacity, AsyncStorage, ScrollView} from 'react-native';
import {createBottomTabNavigator, createStackNavigator, NavigationActions, StackActions} from 'react-navigation';
import firebase from 'firebase';
import DatePicker from 'react-native-datepicker';
import {Button} from 'react-native-elements';

export let currentStyle;
export let lightStyle;
export let darkStyle;
export let styleName = "lightStyle";
export let username = "";

export let firebaseNotes = [];
export let firebaseTodos = [];
export let firebaseReminders = [];

export let pinnedNotes = [];
export let pinnedTodos = [];
export let pinnedReminders = [];

/* Login Screen */
class LoginScreen extends React.Component{
  render(){   
    return(
      <View style={currentStyle.container}>
        <Text style={currentStyle.title}>Login</Text>
        <TextInput 
          style={currentStyle.title}
          placeholder="Username"
          onChangeText={(text) => {username = text}}
          onSubmitEditing={() => {   
            this.props.navigation.dispatch(StackActions.reset({
              index: 0,             
              actions: [NavigationActions.navigate({ routeName: 'Tabs'})]
            }));
          }}
        />
      </View>
    );
  }
}

/* Dashboard */
class HomeScreen extends React.Component{  
  // Component mounting is used to refresh the page when the tab is clicked on
  componentDidMount() {
    this.didFocus = this.props.navigation.addListener(
      'didFocus',
      () => { this.setState({dummy: 1}) },
    );
  }
  componentWillUnmount() {
    this.didFocus.remove();
  }
  // Header
  static navigationOptions = ({navigation}) => {
    return{
      headerTitle: "Dashboard",
    };    
  };
  // Body
  render(){
    return(
      <ScrollView style={currentStyle.scrollView}>
          <View style={currentStyle.container}>
            <Text style={currentStyle.title}>Welcome {username}</Text>
            <Text style={currentStyle.h1}>Here are your Pinned Notes:</Text>            
              {pinnedNotes.map((item, index) =>           
                  <TouchableOpacity
                    key = {item.id}
                    style = {currentStyle.main}
                    onPress = {() => this.props.navigation.navigate('ViewNote', {note: pinnedNotes[index]})}>            
                    <Text style={currentStyle.item}>{item.title}</Text>            
                  </TouchableOpacity>
              )}              
            <Text style={currentStyle.h1}>Here are your Pinned To-Dos:</Text>
            {pinnedTodos.map((item, index) =>           
              <TouchableOpacity
                key = {item.id}
                style = {currentStyle.main}
                onPress = {() => this.props.navigation.navigate('ViewToDo', { todo: pinnedTodos[index]})}>            
                <Text style={currentStyle.item}>{item.title}</Text>            
              </TouchableOpacity>
            )}  
            <Text style={currentStyle.h1}>Here are your Pinned Reminders:</Text>
            {pinnedReminders.map((item, index) => 
              <TouchableOpacity
                key = {item.id}
                style = {currentStyle.main}
                onPress = {() => this.props.navigation.navigate('ViewReminder', {reminder: pinnedReminders[index]})}>            
                <Text style={currentStyle.item}>{item.title}</Text>            
              </TouchableOpacity>
            )}  
            <ActionButton 
              buttonColor="rgba(180,180,180,1)"
              size={40}
              position={"left"}>
              <ActionButton.Item buttonColor='#FF3333' title="Change Theme" onPress={() => {
                if(styleName == "lightStyle"){
                  currentStyle = darkStyle;
                  styleName =  "darkStyle"
                }else{
                  currentStyle = lightStyle;
                  styleName = "lightStyle";
                }
                this.setState({dummy: 1}); // Dummy set to Refresh page
                }}>
                <Ionicons name='home'/>
              </ActionButton.Item>
              <ActionButton.Item buttonColor='#3498db' title="About" onPress={() => {this.props.navigation.navigate('About')}}>
                <Ionicons name='help'/>
              </ActionButton.Item>
            </ActionButton>
            
          </View>
        </ScrollView>
    );
  }
}

/* About Page */
class AboutScreen extends React.Component{
  render(){
    return(
      <ScrollView style={currentStyle.scrollView}>
      <View style={currentStyle.container}>
        <Text style={currentStyle.title}>About</Text>
        <Text style={currentStyle.h1}>Author: Callum Browne</Text>
        <Text style={currentStyle.main}>Built using React-Native: https://facebook.github.io/react-native/</Text>
      </View>
      </ScrollView>
    );
  }
}

///////////////////////////////////////////////////
//////////////* Notes Pages*//////////////////////
/////////////////////////////////////////////////

class NotesScreen extends React.Component{
  // Component mounting is used to refresh the page when the tab is clicked on
  componentDidMount() {
    this.didFocus = this.props.navigation.addListener(
      'didFocus',
      () => { this.setState({dummy: 1}) },
    );
  }

  componentWillUnmount() {
    this.didFocus.remove();
  }

  // Header
  static navigationOptions = ({navigation}) => {
    return{
      headerTitle: "Notes",
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },     
      headerRight:(       
        <Button
          title="Add Note"
          buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
          onPress={ () => { navigation.navigate('AddNote')}}
        />
      ),
    };    
  };
  // Body
  render(){     
    return(
      <ScrollView style={currentStyle.scrollView}>
      <View style={currentStyle.container}>
        <Text style={currentStyle.h1}>Pinned Notes</Text>
        {pinnedNotes.map((item, index) =>           
            <TouchableOpacity
              key = {item.id}
              style = {currentStyle.main}
              onPress = {() => this.props.navigation.navigate('ViewNote', {note: pinnedNotes[index]})}>            
              <Text style={currentStyle.item}>{item.title}</Text>            
            </TouchableOpacity>
        )}    
        <Text style={currentStyle.h1}>All Notes</Text>
        {firebaseNotes.map((item, index) =>        
          <TouchableOpacity
            key = {item.id}
            style = {currentStyle.main}
            onPress = {() => this.props.navigation.navigate('ViewNote', {note: firebaseNotes[index]})}>            
            <Text style={currentStyle.item}>{item.title}</Text>            
          </TouchableOpacity>
        )}        
      </View>
      </ScrollView>
    );
  }
}

class AddNoteScreen extends React.Component{
  constructor(props){
    super(props)
    this.state = {id: "", noteTitle: "", noteDescription: "", pinned: false,}
  }
  render(){
    return(
      <ScrollView style = {currentStyle.scrollView}>
      <View style={currentStyle.container}>
        <Text style={currentStyle.title}>Add Note</Text>
        <TextInput 
          style={currentStyle.h1}
          placeholder="Title"
          onChangeText={(text) => {this.state.noteTitle = text;}}
        />
         <TextInput 
          multiline = {true}
          style={currentStyle.main}
          placeholder="Enter Note Here..."
          onChangeText={(text) => {this.state.noteDescription = text;}}
        />
        <View style={{margin:10}}>
        <Button 
           title={'Pinned: ' + this.state.pinned}
           buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
           onPress={(data) => {
             if(this.state.pinned){
              this.setState({pinned: false});
             }else{
              this.setState({pinned: true});
             }
           }}
        />   
        </View>  
        <View style={{margin:10}}> 
        <Button
          title="Save Note"
          buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
          onPress={ (data) => {
            const noteKey = firebase.database().ref('/Notes').push().key;
            firebase.database().ref('/Notes/' + noteKey).set(
              {
                id: noteKey,
                title: this.state.noteTitle,
                description: this.state.noteDescription,
                pinned: this.state.pinned
              }
            );            
            // Go Back to previous page
            this.props.navigation.goBack();
          }}
        />
        </View>
      </View>
      </ScrollView>
    );
  }
}

class ViewNoteScreen extends React.Component{
  constructor(props){
    super(props);
    let note = this.props.navigation.getParam('note');
    this.state = {id: note.id, title: note.title, description: note.description, pinned: note.pinned,};
  }
  render(){    
    return(
      <ScrollView style={currentStyle.scrollView}>
      <View style={currentStyle.container}>
        <TextInput 
          style={currentStyle.h1}
          onChangeText={(title) => {this.setState({title})}}
          value= {this.state.title}
        />     
        <TextInput 
          multiline = {true}
          style={currentStyle.main}
          onChangeText={(description) => {this.setState({description})}}
          value= {this.state.description}
        />
         <View style={{margin:10}}>
        <Button 
           title={'Pinned: ' + this.state.pinned}
           buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
           onPress={(data) => {
             if(this.state.pinned){
              this.setState({pinned: false});
             }else{
              this.setState({pinned: true});
             }
           }}
        />   
        </View> 
        <View style={{margin:10}}>
        <Button
          title="Save Changes"
          buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
          onPress={ (data, error) => {
            // If the pinned has changed, update pinned list
            if(this.props.navigation.getParam('note').pinned != this.state.pinned){
              if(this.state.pinned){ // Changed to true
                pinnedNotes.push(
                  {
                    id: this.state.id,
                    title: this.state.title,
                    description: this.state.description,
                    pinned: this.state.pinned
                  }
                );
              }else{ // Changed to false
                for(var i = 0; i < pinnedNotes.length; i++){
                  if(this.state.id == pinnedNotes[i].id){ // remove
                    pinnedNotes.splice(i, 1);
                    break;
                  }
                } 
              }
            }
            // Save Edits   
            this.props.navigation.getParam('note').title = this.state.title;
            this.props.navigation.getParam('note').description = this.state.description;
            this.props.navigation.getParam('note').pinned = this.state.pinned;
            // Update Firebase
            firebase.database().ref('/Notes/' + this.state.id).set(
              {
                id: this.state.id,
                title: this.state.title,
                description: this.state.description,
                pinned: this.state.pinned
              }
            );            
            // Go Back to previous page
            this.props.navigation.goBack();
          }}
        />
        </View> 
        <View style={{margin:10}}>
        <Button
          title="Delete Note"
          buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
          onPress={ (data, error) => {
            // Remove from firebase 
            firebase.database().ref('/Notes/' + this.state.id).remove();
            // Remove from firebase
            for(var i = 0; i < firebaseNotes.length; i++){
              if(this.state.id == firebaseNotes[i].id){ // remove
                firebaseNotes.splice(i, 1);
                break;
              }
            }
            // Remove from Pinned List
            for(var i = 0; i < pinnedNotes.length; i++){
              if(this.state.id == pinnedNotes[i].id){ // remove
                pinnedNotes.splice(i, 1);
                break;
              }
            }
            // Go Back to previous page
            this.props.navigation.goBack();
          }}
        />
        </View> 
      </View>
      </ScrollView>
    );
  }
}


///////////////////////////////////////////////////
//////////////* To-Do Pages */////////////////////
/////////////////////////////////////////////////

class ToDosScreen extends React.Component{
  // Component mounting is used to refresh the page when the tab is clicked on
  componentDidMount() {
    this.didFocus = this.props.navigation.addListener(
      'didFocus',
      () => { this.setState({dummy: 1}) },
    );
  }

  componentWillUnmount() {
    this.didFocus.remove();
  }

  // Header
  static navigationOptions = ({navigation}) => {
    return{
      headerTitle: "To-Dos",
      headerRight:(
          <Button
            title="Add To-Do"
            buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
            onPress={ () => { navigation.navigate('AddToDo')}}
          />
      ),
    };    
  };
  // Body
  render(){
    return(
      <ScrollView style={currentStyle.scrollView}>
      <View style={currentStyle.container}>
        <Text style={currentStyle.h1}>Pinned To-Dos</Text>
        {pinnedTodos.map((item, index) =>           
          <TouchableOpacity
            key = {item.id}
            style = {currentStyle.main}
            onPress = {() => this.props.navigation.navigate('ViewToDo', { todo: pinnedTodos[index]})}>            
            <Text style={currentStyle.item}>{item.title}</Text>            
          </TouchableOpacity>
        )}  
        <Text style={currentStyle.h1}>All To-Dos</Text>
        {firebaseTodos.map((item, index) =>           
          <TouchableOpacity
            key = {item.id}
            style = {currentStyle.main}
            onPress = {() => this.props.navigation.navigate('ViewToDo', { todo: firebaseTodos[index]})}>            
            <Text style={currentStyle.item}>{item.title}</Text>            
          </TouchableOpacity>
        )}    
      </View>
      </ScrollView>
    );
  }
}

class AddToDoScreen extends React.Component{
  constructor(props){
    super(props)
    this.state = {todoTitle: "", todoItem: "", todoList: [], pinned: false}
    alert('Sometimes the list does not display data while entering. Fear not, if this happends it will still save your data, which can then be viewed.');
  }
  // Body
  render(){
    return(
      <ScrollView style={currentStyle.scrollView}>
      <View style={currentStyle.container}>
        <Text style={currentStyle.title}>Add To-Do</Text>
        <TextInput 
          style={currentStyle.title}
          placeholder="Title"
          onChangeText={(text) => {this.state.todoTitle = text;}}
        />
         <TextInput 
          style={currentStyle.main}
          placeholder="To-Do Here..."
          onChangeText={(text) => {this.state.todoItem = text;}}
          onSubmitEditing={(text) => {
            this.state.todoList.push(this.state.todoItem);
            this.setState({todoList: this.state.todoList});
          }}
        />
        <FlatList
          data={this.state.todoList}
          renderItem={({item}) => <Text style={currentStyle.item}>{item}</Text>}
        />
        <View style={{margin:10}}>
         <Button 
           title={'Pinned: ' + this.state.pinned}
           buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
           onPress={(data) => {
             if(this.state.pinned){
              this.setState({pinned: false});
             }else{
              this.setState({pinned: true});
             }
           }}
        />   
        </View>
        <View style={{margin:10}}>
        <Button
          title="Save To-Do"
          buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
          onPress={ (data, error) => {
            const todoRef = firebase.database().ref('To-Dos/').push().key;
            firebase.database().ref('/To-Dos/' + todoRef).set(
              {
                id: todoRef,
                title: this.state.todoTitle,
                list: this.state.todoList,
                pinned: this.state.pinned
              }
            );                   
            // Go Back to previous page
            this.props.navigation.goBack();
          }}
        />
        </View>
      </View>
      </ScrollView>
    );
  }
}

class ViewToDoScreen extends React.Component{
  constructor(props){
    super(props);
    let todo = this.props.navigation.getParam('todo');
    this.state = {id: todo.id, title: todo.title, list: todo.list, todoItem: "", pinned: todo.pinned};
    alert('Sometimes the list does not display while entering. Fear not, if this happends it will still save your data, which can then be viewed.');
  }
  render(){
    return(
      <ScrollView style={currentStyle.scrollView}>
      <View style={currentStyle.container}>
        <TextInput 
          style={currentStyle.h1}
          onChangeText={(title) => {this.setState({title})}}
          value= {this.state.title}
        />
        <TextInput 
          style={currentStyle.main}
          placeholder="To-Do Here..."
          onChangeText={(text) => {this.state.todoItem = text;}}
          onSubmitEditing={(text) => {
            this.state.list.push(this.state.todoItem);
            this.setState({list: this.state.list});
          }}
        />
        <FlatList
          data={this.state.list}
          renderItem={({item}) => <Text style={currentStyle.item}>{item}</Text>}
        />
        <View style={{margin:10}}>
        <Button 
           title={'Pinned: ' + this.state.pinned}
           buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
           onPress={(data) => {
             if(this.state.pinned){
              this.setState({pinned: false});
             }else{
              this.setState({pinned: true});
             }
           }}
        />   
        </View> 
        <View style={{margin:10}}>
        <Button
          title="Save Changes"
          buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
          onPress={ (data, error) => {
            // If the pinned has changed, update pinned list
            if(this.props.navigation.getParam('todo').pinned != this.state.pinned){
              if(this.state.pinned){ // Changed to true
                pinnedTodos.push(
                  {
                    id: this.state.id,
                    title: this.state.title,
                    list: this.state.list,
                    pinned: this.state.pinned
                  }
                );
              }else{ // Changed to false
                for(var i = 0; i < pinnedTodos.length; i++){
                  if(this.state.id == pinnedTodos[i].id){ // remove
                    pinnedTodos.splice(i, 1);
                    break;
                  }
                } 
              }
            }
            // Save Edits    
            this.props.navigation.getParam('todo').title = this.state.title;
            this.props.navigation.getParam('todo').list = this.state.list;
            this.props.navigation.getParam('todo').pinned = this.state.pinned;
            // Update Firebase
            firebase.database().ref('/To-Dos/' + this.state.id).set(
              {
                id: this.state.id,
                title: this.state.title,
                list: this.state.list,
                pinned: this.state.pinned
              }
            );
            // Go Back to previous page
            this.props.navigation.goBack();
          }}
        />
        </View>
        <View style={{margin:10}}>
        <Button
          title="Delete Note"
          buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
          onPress={ (data, error) => {
            // Remove from firebase 
            firebase.database().ref('/To-Dos/' + this.state.id).remove();
            // Remove from Local List
            for(var i = 0; i < firebaseTodos.length; i++){
              if(this.state.id == firebaseTodos[i].id){ // remove
                firebaseTodos.splice(i, 1);
                break;
              }
            }
             // Remove from Pinned List
             for(var i = 0; i < pinnedTodos.length; i++){
              if(this.state.id == pinnedTodos[i].id){ // remove
                pinnedTodos.splice(i, 1);
                break;
              }
            }
            // Go Back to previous page
            this.props.navigation.goBack();
          }}
        />
        </View>
      </View>
      </ScrollView>
    );
  }
}

//////////////////////////////////////////////////////
//////////////* Reminder Pages*//////////////////////
////////////////////////////////////////////////////

class RemindersScreen extends React.Component{
  // Component mounting is used to refresh the page when the tab is clicked on
  componentDidMount() {
    this.didFocus = this.props.navigation.addListener(
      'didFocus',
      () => { this.setState({dummy: 1}) },
    );
  }

  componentWillUnmount() {
    this.didFocus.remove();
  }

  // Header
  static navigationOptions = ({navigation}) => {
    return{
      headerTitle: "Reminders",
      headerRight:(
        <Button
          title="Add Reminder"
          buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
          onPress={ () => { navigation.navigate('AddReminder')}}
        />
      ),
    };    
  };
  render(){
    return(
      <ScrollView style={currentStyle.scrollView}>
      <View style={currentStyle.container}>
        <Text style={currentStyle.h1}>Pinned Reminders</Text>
        {pinnedReminders.map((item, index) => 
          <TouchableOpacity
            key = {item.id}
            style = {currentStyle.main}
            onPress = {() => this.props.navigation.navigate('ViewReminder', {reminder: pinnedReminders[index]})}>            
            <Text style={currentStyle.item}>{item.title}</Text>            
          </TouchableOpacity>
        )}  
        <Text style={currentStyle.h1}>All Reminders</Text>
        {firebaseReminders.map((item, index) => 
          <TouchableOpacity
            key = {item.id}
            style = {currentStyle.main}
            onPress = {() => this.props.navigation.navigate('ViewReminder', {reminder: firebaseReminders[index]})}>            
            <Text style={currentStyle.item}>{item.title}</Text>            
          </TouchableOpacity>
        )}  
      </View>
      </ScrollView>
    );
  }
}

class AddReminderScreen extends React.Component{
  constructor(props){
    super(props)
    this.state = {title: "", description: "", datetime:"2016-05-15 12-0", pinned: false}
  }
  // Body
  render(){ 
    return(
      <ScrollView style={currentStyle.scrollView}>
      <View style={currentStyle.container}>
        <Text style={currentStyle.title}>Add Reminder</Text>
        <TextInput 
          style={currentStyle.h1}
          placeholder="Title"
          onChangeText={(title) => {this.state.title = title}}
        />
         <TextInput 
          multiline = {true}
          style={currentStyle.main}
          placeholder="Description"
          onChangeText={(description) => {this.state.description = description}}
        />
        <DatePicker
          style={{width: 200}}
          date={this.state.datetime}
          mode="datetime"
          format="YYYY-MM-DD HH:mm"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIonicons: {
              position: 'absolute',
              left: 0,
              top: 4,
              bottom: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
        }}
          onDateChange={(datetime) => {this.setState({datetime})}}
        /> 
        <View style={{margin:10}}>
        <Button 
           title={'Pinned: ' + this.state.pinned}
           buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
           onPress={(data) => {
             if(this.state.pinned){
              this.setState({pinned: false});
             }else{
              this.setState({pinned: true});
             }
           }}
        />      
        </View>
        <View style={{margin:10}}>
        <Button
          title="Save Reminder"
          buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
          onPress={ (data, error) => {
            const reminderRef = firebase.database().ref('Reminders/').push().key;
            firebase.database().ref('/Reminders/' + reminderRef).set(
              {
                id: reminderRef,
                title: this.state.title,
                description: this.state.description,
                datetime: this.state.datetime,
                pinned: this.state.pinned
              }
            );            
            // Go Back to previous page
            this.props.navigation.goBack();
          }}
        />
        </View>
      </View>
      </ScrollView>
    );
  }
}

class ViewReminderScreen extends React.Component{
  constructor(props){   
    super(props);
    let reminder = this.props.navigation.getParam('reminder');
    this.state = {id: reminder.id, title: reminder.title, description: reminder.description, datetime: reminder.datetime, pinned: reminder.pinned};
  }
  render(){
    return(
      <ScrollView style={currentStyle.scrollView}>
      <View style={currentStyle.container}>
        <TextInput 
          style={currentStyle.h1}
          onChangeText={(title) => {this.setState({title})}}
          value= {this.state.title}
        />
        <TextInput 
          multiline = {true}
          style={currentStyle.main}
          onChangeText={(description) => {this.setState({description})}}
          value= {this.state.description}
        />
        <DatePicker
          style={{width: 200}}
          date={this.state.datetime}
          mode="datetime"
          format="YYYY-MM-DD HH:mm"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIonicons: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
        }}
          onDateChange={(datetime) => {this.setState({datetime})}}
        /> 
        <View style={{margin:10}}>  
        <Button 
           title={'Pinned: ' + this.state.pinned}
           buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
           onPress={(data) => {
             if(this.state.pinned){
              this.setState({pinned: false});
             }else{
              this.setState({pinned: true});
             }
           }}
        />       
        </View>
        <View style={{margin:10}}>
        <Button
          title="Save Changes"
          buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
          onPress={ (data, error) => {
            // If the pinned has changed, update pinned list
            if(this.props.navigation.getParam('reminder').pinned != this.state.pinned){
              if(this.state.pinned){ // Changed to true
                pinnedReminders.push(
                  {
                    id: this.state.id,
                    title: this.state.title,
                    description: this.state.description,
                    datetime: this.state.datetime,
                    pinned: this.state.pinned
                  }
                );
              }else{ // Changed to false
                for(var i = 0; i < pinnedReminders.length; i++){
                  if(this.state.id == pinnedReminders[i].id){ // remove
                    pinnedReminders.splice(i, 1);
                    break;
                  }
                } 
              }
            }
            // Save Edits    
            this.props.navigation.getParam('reminder').title = this.state.title;
            this.props.navigation.getParam('reminder').description = this.state.description;
            this.props.navigation.getParam('reminder').datetime = this.state.datetime;
            this.props.navigation.getParam('reminder').pinned = this.state.pinned;
            // Update Firebase
            firebase.database().ref('/Reminders/' + this.state.id).set(
              {
                id: this.state.id,
                title: this.state.title,
                description: this.state.description,
                datetime: this.state.datetime,
                pinned: this.state.pinned
              }
            );
            // Go Back to previous page
            this.props.navigation.goBack(); 
          }}
        />
        </View>
        <View style={{margin:10}}>
        <Button
          title="Delete Reminder"
          buttonStyle={{backgroundColor: "rgba(50, 75, 225, 1)", }}
          onPress={ (data, error) => {
            // Remove from firebase 
            firebase.database().ref('/Reminders/' + this.state.id).remove();
            // Remove from Local List
            for(var i = 0; i < firebaseReminders.length; i++){
              if(this.state.id == firebaseReminders[i].id){ // remove
                firebaseReminders.splice(i, 1);
                break;
              }
            }
            // Remove from Pinned List
            for(var i = 0; i < pinnedReminders.length; i++){
              if(this.state.id == pinnedReminders[i].id){ // remove
                pinnedReminders.splice(i, 1);
                break;
              }
            }
            // Go Back to previous page
            this.props.navigation.goBack();
          }}
        />
        </View>
      </View>
      </ScrollView>
    );
  }
}

//////////////////////////////////////////////////////
/////////////* Navigation Stacks *///////////////////
////////////////////////////////////////////////////

/**
 * Home Stack - Contains all the todos relating to the todos page
 */
const HomeStack = createStackNavigator({
  Home: HomeScreen,
  About: AboutScreen
});

/**
 * Notes Stack - Contains all the notes relating to the notes page
 */
const NotesStack = createStackNavigator({
  NotesHome: NotesScreen,
  AddNote: AddNoteScreen,
  ViewNote: ViewNoteScreen,
});

/**
 * ToDos Stack - Contains all the todos relating to the todos page
 */
const ToDosStack = createStackNavigator({
  ToDosHome: ToDosScreen,
  AddToDo: AddToDoScreen,
  ViewToDo: ViewToDoScreen,
});

/**
 * Reminders Stack - Contains all the reminders relating to the reminders page
 */
const RemindersStack = createStackNavigator({
  RemindersHome: RemindersScreen,
  AddReminder: AddReminderScreen,
  ViewReminder: ViewReminderScreen,
});

/**
 * Tabs Container - Contains all the stacks for each main aspect of the app
 */
const TabsStack = createBottomTabNavigator({
  Home: HomeStack,
  Notes: NotesStack,
  ToDos: ToDosStack,
  Reminders: RemindersStack,
},
  {
    navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Home') {
        iconName = `home`;
      } else if (routeName === 'Notes') {
        iconName = `book`;
      }else if (routeName === 'ToDos') {
        iconName = `done-all`;
      }else if (routeName === 'Reminders') {
        iconName = `notifications`;
      }
      return <Ionicons name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
    },
  }),
});

/**
 * Login Stack
 */
const LoginStack = createStackNavigator({
  Login: LoginScreen,
  Tabs: TabsStack
},{ 
  headerMode: 'none'
});

/**
 * App Entry Point
 */
export default class App extends React.Component {
  render() {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCvIDZ55hzXkWEP70KN0xIVFQxDwSlAMUM",
      authDomain: "react-native-database-6056d.firebaseapp.com",
      databaseURL: "https://react-native-database-6056d.firebaseio.com",
      projectId: "react-native-database-6056d",
      storageBucket: "",
      messagingSenderId: "135196826729"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    // Check if we are online, and decide whether we load from local or firebase
    firebase.database().ref('.info/connected').on('value', function(connectedSnap) {
      if (connectedSnap.val() === true) { // We are online, clear local storage and get updated version
        pinnedNotes = [];
        pinnedTodos = [];
        pinnedReminders = [];
        console.log('Connected');
        // Load in the notes
        firebase.database().ref('/Notes').orderByKey().on("child_added", function(snapshot) { // Get each child
          var n = snapshot.val();
          if(n.pinned){
            pinnedNotes.push(n);
            // Update Local Storage
            AsyncStorage.setItem('pinnedNotes', JSON.stringify(pinnedNotes)).then(()=>{
              console.log('Set Notes');    
            }).catch(() => console.log('Problem setting Notes'));
          }
          firebaseNotes.push(n);          
        });
        // Load in the todos
        firebase.database().ref('/To-Dos').orderByKey().on("child_added", function(snapshot) { // Get each child
          var t = snapshot.val();
          if(t.pinned){
            pinnedTodos.push(t);
            AsyncStorage.setItem('pinnedTodos', JSON.stringify(pinnedTodos)).then(()=>{
              console.log('Set Todos');    
            }).catch(() => console.log('Problem setting Todos'));
          }
          firebaseTodos.push(t);          
        });
        // Load in the reminders
        firebase.database().ref('/Reminders').orderByKey().on("child_added", function(snapshot) { // Get each child
          var r = snapshot.val();
          if(r.pinned){
            pinnedReminders.push(r);
            AsyncStorage.setItem('pinnedReminders', JSON.stringify(pinnedReminders)).then(()=>{
              console.log('Set Reminders');    
            }).catch(() => console.log('Problem setting Reminders'));
          }
          firebaseReminders.push(r);             
        });
      } else { // Load from local storage
        console.log('No Connection, loading stored Notes');
        AsyncStorage.getItem('pinnedNotes').then((storedNotes) => {
          let parsedNotes = []
          parsedNotes = JSON.parse(storedNotes);
          pinnedNotes = parsedNotes;
          console.log('Loaded Pinned Notes');    
        }).catch(() => console.log('Problem With Notes'));

        AsyncStorage.getItem('pinnedTodos').then((storedTodos)=>{
          let parsedTodos =[];
          parsedTodos = JSON.parse(storedTodos);
          pinnedTodos = parsedTodos;
          console.log('Loaded Pinned Todos');    
        }).catch(() => console.log('Problem With Todos'));

        AsyncStorage.getItem('pinnedReminders').then((storedReminders)=>{
          let parsedReminders = [];
          parsedReminders = JSON.parse(storedReminders);
          pinnedReminders = parsedReminders;
          console.log('Loaded Pinned Reminders');    
        }).catch(() => console.log('Problem With Reminders'));        
      }
    });
    
    // Load in styles
    var myStyles = require('./Styles.js');
    lightStyle = myStyles.lightStyle;
    darkStyle = myStyles.darkStyle;
    currentStyle = lightStyle;
    console.disableYellowBox = true;
    return <LoginStack />;
  }
}