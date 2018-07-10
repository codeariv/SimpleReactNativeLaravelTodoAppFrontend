import React, { Component } from "react";
import { TouchableOpacity, StatusBar, Keyboard } from 'react-native';
import { Container, View, Header, Content, List, ListItem, Text, Left, Body, Title, Item, Input, Right, Icon, Button } from "native-base";
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      task: null,
      tasks: [],
      c_tasks: [],
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.getAlertWeb(), 1000);
  }

  async getAlertWeb() {
    return fetch("http://192.168.42.177/LaravelBackend/public/api/tasks")
      .then(response => response.json())
      .then(responseJson => {     
        this.setState({
          tasks: responseJson.tasks,
          c_tasks: responseJson.c_tasks
        }, function() {
          //comment
        });
      })
      .catch(error => {
        null;
      });
  }

  addTask = () => {
    fetch('http://192.168.42.177/LaravelBackend/public/api/task', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "task": this.state.task,

       }),
    })
    .then((response) => response.json())
    .then((responseData) => {
            "POST Response",
            "Response Body -> " + JSON.stringify(responseData)
    })
    .done();   
    this.input._root.clear();
    Keyboard.dismiss();
};


completeTask = (id) => { 
  fetch(`http://192.168.42.177/LaravelBackend/public/api/task/${id}/complete`)
  .done();    
};

deleteTask = (id) => { 
  fetch(`http://192.168.42.177/LaravelBackend/public/api/task/${id}/delete`)
  .done();    
};

  render() {
    return (
      <Container>

        <Header androidStatusBarColor="#1362af" style={{ backgroundColor: '#1976D2' }}>
          <Body style = {{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
            <Title>TODO</Title>
          </Body>
        </Header>
        <Content style = {{ marginLeft: 10, marginRight:10 }}>
        <Item rounded style = {{ marginBottom: 20, marginTop:20 }}>
          <Input placeholder="Add Task" 
          onChangeText={input => this.setState({ task: input })} 
          ref={(ref) => { this.input = ref }}
          />
        </Item>
        <Button block light onPress={ () => this.addTask() } style = {{ marginLeft: 30, marginRight:30 }}>
            <Text>Add</Text>
        </Button>

          <List
            dataArray={this.state.tasks}
            renderRow={item => (
              <ListItem style = {{ marginTop:5, }}>
                <Left>
                  <Text style = {{ fontSize:17, color:'#5b5757', }}>{item.task}</Text>
                </Left>
                <Right>
                    <TouchableOpacity onPress={ () => {this.completeTask(item.id)} } hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}>
                        <Icon name="ios-checkmark" style={{fontSize: 30, color: '#41f444'}} />
                    </TouchableOpacity>
                    </Right>
              </ListItem>
            )}
          />
        <View style = {{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop:20 }}>
          <Text style = {{ fontSize:18, fontWeight: 'bold', color:'#d7dadd', }}>COMPLETED</Text>
        </View>
        <List
            dataArray={this.state.c_tasks}
            renderRow={item => (
              <ListItem style = {{ marginTop:5, }}>
                <Left>
                  <Text style = {{ fontSize:17, color:'#5b5757', }}>{item.task}</Text>
                </Left>
                <Right>   
                    <TouchableOpacity onPress={ () => {this.deleteTask(item.id)} } hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}>                 
                        <Icon name="ios-close" style={{fontSize: 30, color: '#e01414'}} />
                    </TouchableOpacity>
                    </Right>
              </ListItem>
            )}
          />

        </Content>
      </Container>
    );
  }
}
