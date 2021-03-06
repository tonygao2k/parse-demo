/***
 * GIT Test
 */
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
        this.subscription = null;

        this.startTest = this.startTest.bind(this);
        this.stopTest = this.stopTest.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.modify = this.modify.bind(this);
        this.queryAll = this.queryAll.bind(this);
        this.queryUsers = this.queryUsers.bind(this);
        this.openLiveQuery = this.openLiveQuery.bind(this);
        this.closeLiveQuery = this.closeLiveQuery.bind(this);

        this.state = {
            liveQuery: false,
            pressureTest: false
        }
    }

    async componentDidMount() {
        Parse.initialize("123456");
        Parse.serverURL = 'http://192.168.1.102:8080/parse';
        Parse.liveQueryServerURL = 'ws://192.168.1.102:18080';
        this.TestDB = new Parse.Object.extend('Test');

        this.openLiveQuery();
    }

    async openLiveQuery() {
        let query = new Parse.Query(this.TestDB);
        this.subscription = await query.subscribe();

        this.setState({
            liveQuery: true
        })

        this.subscription.on('open', ()=>{
            console.log('socket connection established');
        });

        this.subscription.on('close', ()=>{
            console.log('socket connection closed');
        });

        this.subscription.on('error', (err)=>{
            console.log(err);
        });

        this.subscription.on('enter', (obj)=>{
            console.log('object ' + obj.id + ' entered');
        });

        this.subscription.on('leave', (obj)=>{
            console.log('object ' + obj.id + ' left');
        });

        this.subscription.on('create', (obj)=>{
            console.log('object ' + obj.id + ' created');
        });

        this.subscription.on('update', (obj)=>{
            console.log('object ' + obj.id +  ' updated ');
        });

        this.subscription.on('delete', (obj)=>{
            console.log('object ' + obj.id + ' deleted ');
        });
    }

    closeLiveQuery() {
        if (this.subscription !== null) {
            this.subscription.unsubscribe();
            this.subscription = null;

            this.setState({
                liveQuery: false
            })
        }
    }

    startTest() {
        let doTest = (id)=> {
            let testDB = new this.TestDB();

            testDB.save({
                uid: id,
                name: 'usr_' + id,
                age: id,
                activity:{
                    timestamp: new Date().getTime(),
                    location: {
                        w: 120,
                        h: 130,
                        top: 9
                    }
                }
            });
        }

        let cnt = 0;
        this.interval = setInterval(()=>{
            doTest(++cnt);
        }, 500);

        this.setState({
            pressureTest: true
        });
    }

    stopTest() {
        clearInterval(this.interval);
        this.interval = null;

        this.setState({
            pressureTest: false
        });
    }

    async deleteAll() {
        let query = new Parse.Query(this.TestDB);
        query.limit(20000);
        let objs = await query.find();
        let length = objs.length;

        for (let i = 0; i < length; i++) {
            await objs[i].destroy();
        }

        console.log("Total " + length + " objects deleted");
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
            console.log(objs[i].toJSON());
        }

        console.log("Total " + length + " objects founded");
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
        let btnLiveQuery, btnPressureTest;

        if (this.state.liveQuery) {
            btnLiveQuery = <Button variant="contained" color="secondary" onClick={this.closeLiveQuery}>????????????</Button>;
        } else {
            btnLiveQuery = <Button variant="contained" onClick={this.openLiveQuery}>????????????</Button>
        }

        if (this.state.pressureTest) {
            btnPressureTest = <Button variant="contained" color="secondary" onClick={this.stopTest}>??????????????????</Button>;
        } else {
            btnPressureTest = <Button variant="contained" onClick={this.startTest}>??????????????????</Button>
        }

        return (
            <div className="App">
                <header className="App-Container">
                    <Stack spacing={2} direction="row">
                        {btnLiveQuery}
                        {btnPressureTest}
                        <Button variant="contained" onClick={this.queryAll}>????????????</Button>
                        <Button variant="contained" onClick={this.queryUsers}>????????????</Button>
                        <Button variant="contained" onClick={this.modify}>????????????</Button>
                        <Button variant="contained" onClick={this.deleteAll}>??????????????????</Button>
                    </Stack>
                </header>
            </div>
        );
    }
}

export default App;
