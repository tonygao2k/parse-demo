import React from 'react';
import Button from '@material-ui/core/Button';
import Stack from '@material-ui/core/Stack';
import Parse from 'parse/dist/parse.min.js';
import data from './data/test.json';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.demoDB = null;
        this.query = null;

        Parse.initialize("123456");
        Parse.serverURL = 'http://192.168.1.102:8080/parse';
        Parse.liveQueryServerURL = 'ws://192.168.1.102:18080';

        let DemoDB = new Parse.Object.extend('Demo');
        this.demoDB = new DemoDB();
        this.query = new Parse.Query(DemoDB);
        this.query.limit(10000);

        this.saveObj = this.saveObj.bind(this);
        this.queryAll = this.queryAll.bind(this);
        this.query_1 = this.query_1.bind(this);
    }

    componentDidMount() {

    }

    saveObj() {
        this.demoDB.save(data)
            .then(
                (demoDB) => {
                    console.log("Save Data Success!!!");
                    this.demoDB = demoDB;
                },
                (err) => {
                    console.log(err);
                }
            );
    }

    async queryAll() {
        let obj = await this.query.find();
        let res = obj[0].toJSON();
        console.log(res);
    }

    async query_1() {
        this.query.equalTo();
        const obj = await this.query.find();
        let val1 = obj[0].get('singleVal');
        let val2 = obj[0].get('arrayVal');
        let val3 = obj[0].get('jsonVal');
        let val4 = obj[0].get('UID_001');

        console.log(val1);
        console.log(val2);
        console.log(val3);
        console.log(val4);
    }

    render() {
        return (
            <div className="App">
                <header className="App-Container">
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" onClick={this.saveObj}>保存对象</Button>
                        <Button variant="contained" onClick={this.queryAll}>获取全部数据</Button>
                        <Button variant="contained" onClick={this.query_1}>查询1</Button>
                    </Stack>
                </header>
            </div>
        );
    }
}

export default App;
