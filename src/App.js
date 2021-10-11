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
        this.modify = this.modify.bind(this);
        this.queryAll = this.queryAll.bind(this);
        this.queryUsers = this.queryUsers.bind(this);
        this.liveQuery = this.liveQuery.bind(this);
    }

    async componentDidMount() {
        Parse.initialize("123456");
        Parse.serverURL = 'http://192.168.1.102:8080/parse';
        Parse.liveQueryServerURL = 'ws://192.168.1.102:18080';
        this.TestDB = new Parse.Object.extend('Test');
    }

    async liveQuery() {
        let query = new Parse.Query(this.TestDB);
        let subscription = await query.subscribe();

        subscription.on('open', ()=>{
            console.log('socket connection established');
        });

        subscription.on('close', ()=>{
            console.log('socket connection closed');
        });

        subscription.on('error', (err)=>{
            console.log(err);
        });

        subscription.on('enter', (obj)=>{
            console.log('object ' + obj.id + ' entered');
        });

        subscription.on('leave', (obj)=>{
            console.log('object ' + obj.id + ' left');
        });

        subscription.on('create', (obj)=>{
            console.log('object ' + obj.id + ' created');
        });

        subscription.on('update', (obj)=>{
            console.log('object ' + obj.id +  ' updated ');
        });

        subscription.on('delete', (obj)=>{
            console.log('object ' + obj.id + ' deleted ');
        });
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
        query.limit(20000);
        let objs = await query.find();
        let length = objs.length;

        for (let i = 0; i < length; i++) {
            await objs[i].destroy();
        }

        console.log("Total " + length + " objects deleted!");
    }

    async modify() {
        let query = new Parse.Query(this.TestDB);
        query.limit(20000);
        query.equalTo("uid", 1);

        let objs = await query.find();
        let length = objs.length;

        for (let i = 0; i < length; i++) {
            let obj = objs[i];
            obj.set("name", "M_" + new Date().getTime());
            await obj.save();
        }

        console.log("Total " + length + " objects modified");
    }

    async queryAll() {
        let query = new Parse.Query(this.TestDB);
        query.limit(20000);
        let objs = await query.find();
        let length = objs.length;

        for (let i = 0; i < length; i++) {
            console.log(i + " " + objs[i].get('name'));
        }
    }

    async queryUsers() {
        let query = new Parse.Query(this.TestDB);
        query.limit(20000);
        query.equalTo("uid", 1);

        let objs = await query.find();
        let length = objs.length;

        for (let i = 0; i < length; i++) {
            console.log(objs[i].toJSON());
        }

        console.log("Total " + length + " objects founded");
    }

    render() {
        return (
            <div className="App">
                <header className="App-Container">
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" onClick={this.liveQuery}>打开监听</Button>
                        <Button variant="contained" onClick={this.queryAll}>获取全部数据</Button>
                        <Button variant="contained" onClick={this.queryUsers}>获取查询数据</Button>
                        <Button variant="contained" onClick={this.modify}>修改数据</Button>
                        <Button variant="contained" onClick={this.startTest}>开始压力测试</Button>
                        <Button variant="contained" onClick={this.stopTest}>结束压力测试</Button>
                        <Button variant="contained" onClick={this.deleteAll}>清空测试数据</Button>
                    </Stack>
                </header>
            </div>
        );
    }
}

export default App;
