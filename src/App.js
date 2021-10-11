import React from 'react';
import Button from '@material-ui/core/Button';
import Stack from '@material-ui/core/Stack';
import Parse from 'parse/dist/parse.min.js';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.TestDB = null;
        this.interval = null;

        this.startTest = this.startTest.bind(this);
        this.stopTest = this.stopTest.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.queryAll = this.queryAll.bind(this);
    }

    componentDidMount() {
        Parse.initialize("123456");
        Parse.serverURL = 'http://192.168.1.102:8080/parse';
        Parse.liveQueryServerURL = 'ws://192.168.1.102:18080';
        this.TestDB = new Parse.Object.extend('Test');
    }

    startTest() {
        let doTest = (id)=> {
            let testDB = new this.TestDB();

            const data = {
                uid: id,
                name: 'usr_' + id,
                age: id
            }

            testDB.save(data)
                .then((obj) => {
                    console.log(obj.id + " Save Data Success!!! ");
                },
                (err) => {
                    console.log(err);
                });
        }

        let cnt = 0;
        this.interval = setInterval(()=>{
            doTest(++cnt);
        }, 500);
    }

    stopTest() {
        clearInterval(this.interval);
        this.interval = null;
    }

    async deleteAll() {
        let query = new Parse.Query(this.TestDB);
        let objs = await query.find();

        for (let i = 0; i < objs.length; i++) {
            objs[i].destroy()
                .then((obj) => {
                    console.log("Delete Object " + obj.id + " Success!!!");
                },
                (err) => {
                    console.log(err);
                });
        }
    }

    async queryAll() {
        let query = new Parse.Query(this.TestDB);
        let objs = await query.find();

        for (let i = 0; i < objs.length; i++) {
            console.log(objs[i].toJSON());
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-Container">
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" onClick={this.startTest}>开始测试</Button>
                        <Button variant="contained" onClick={this.stopTest}>结束测试</Button>
                        <Button variant="contained" onClick={this.deleteAll}>清空测试数据</Button>
                        <Button variant="contained" onClick={this.queryAll}>获取全部数据</Button>
                    </Stack>
                </header>
            </div>
        );
    }
}

export default App;
