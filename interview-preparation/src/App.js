import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Headers from "./Components/Headers";
import Question from "./Components/Question";

import QAlist from "./Components/QAlist";

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: "",
      ansItem: "",
      editId: "",
      ques: [],
      ans: [],
      queries: []
    };
  }

  UNSAFE_componentWillMount() {
    this.setState({ queries: this.state.ques });
    axios
      .get("http://13.126.28.110:1234/get")
      .then(result => {
        this.setState({ ques: result.data, queries: result.data });
      })
      .catch(err => {
        console.log("err in getting ques in willmount", err);
      });

    axios
      .get("http://13.126.28.110:1234/getAns")
      .then(result => {
        this.setState({ ans: result.data });
      })
      .catch(err => {
        console.log("err in getting answer in will mount", err);
      });
  }

  onChangeHandler = e => {
    this.setState({
      item: e.target.value
    });
  };
  ansChangeHandler = e => {
    this.setState({ editId: e.target.id, ansItem: e.target.value });
  };

  addQues = e => {
    if (e.key === "Enter") {
      // console.log('this is ques',e.target.value)
      if (e.target.value.length > 0) {
        axios
          .post("http://13.126.28.110:1234/question", {
            Question: e.target.value
          })
          .then(data => {
            console.log("data sent to backned ", data.data);
            this.setState({ ques: data.data, item: "" });
          })
          .catch(err => {
            console.log("err in sending data into the database ", err);
          });
      }
    }
  };

  addAns = e => {
    if (e.key === "Enter") {
      if (e.target.value.length > 0) {
        axios
          .post("http://13.126.28.110:1234/answer", {
            Q_id: e.target.id,
            answer: e.target.value
          })
          .then(result => {
            var ansIns = this.state.ans;
            var l = result.data.length - 1;
            ansIns.push(result.data[l]);
            this.setState({ ans: ansIns, ansItem: "", editId: "" });
          })
          .catch(err => {
            console.log("err in sending ans into backend", err);
          });
      }
    }
  };

  userSearch = text => {
    // console.log(this.state.ques)
    new Promise((resolve, reject) => {
      var data = this.state.ques.filter(e => e.question.toLowerCase().startsWith(text))
      if(data.length>0){
        resolve(data)
      }else{
        resolve(
          this.state.ques.filter(e=>{return e.question.toLowerCase().includes(text)})
        )
      }
      
    })
      .then(userValue => {
        if (userValue.length > 0) {
          this.setState({ queries: userValue });
        } else {
          this.setState({ queries: this.state.ques });
        }
      })
      .catch(err => {
        console.log("err while trying to change ques a/c to user query", err);
      });
  };

  render() {
    return (
      <div className="app">
        <Headers userSearch={this.userSearch} />
        <Question
          addQues={this.addQues}
          item={this.state.item}
          onChangeHandler={this.onChangeHandler}
        />
        <QAlist
          Qlist={this.state.queries}
          ans={this.state.ans}
          addAns={this.addAns}
          ansItem={this.state.ansItem}
          editId={this.state.editId}
          ansChangeHandler={this.ansChangeHandler}
        />
      </div>
    );
  }
}

export default App;
