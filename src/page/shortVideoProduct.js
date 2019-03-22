import React, { Component } from 'react';
// import Link from 'umi/link';
import { connect } from 'dva';

import request from "../util/request"

import {
  Input,
  Button,
  Col,
  Icon,
  Radio,
  Slider,
} from 'antd';
import RadioButton from "antd/es/radio/radioButton";

class SearchPage extends Component {

  state = {
    videoIdReady: false,
    videoId: undefined,
    videoName: "",
    taskType: "screen_relay",
    comedyTemplates: {
      1:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/ed/starworks_template_1.jpeg",
      2:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/1c/starworks_template_2.jpeg",
      3:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/4a/starworks_template_3.jpeg",
      4:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/78/starworks_template_4.jpeg",
      5:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/a6/starworks_template_5.jpeg",
      6:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/d4/starworks_template_6.jpeg",
    },
    comedyTemplateId: 0
  };

  videoNameChanged = (e) => {
    console.log("videoName:", e.target.value);
    this.setState({
      videoName: e.target.value
    },this.getVideoIdByName)
  };

  onTaskTypeChange = (e) => {
    console.log('task type radio checked', e.target.value);
    this.setState({
      taskType: e.target.value,
    });
  };

  getVideoIdByName = () => {
    if(this.state.videoName.trim() === ""){
      this.setState({
        videoId: undefined,
        videoIdReady: false
      })
    } else if(!isNaN(this.state.videoName)){
      this.setState({
        videoId: parseInt(this.state.videoName),
        videoIdReady: true
      })
    } else {
      let result = request(`/apis/views/name2id?type=2&name=${this.state.videoName}`);
      result.then((r)=>{
        if (r.result && r.result.id && r.result.id !== 0) {
          this.setState({
            videoId: r.result.id,
            videoIdReady: true
          })
        } else {
          this.setState({
            videoId: undefined,
            videoIdReady: false
          })
        }
      });
    }
  };

  onTemplateChange = (e) => {
    console.log('template radio checked', e.target.value);
    this.setState({
      comedyTemplateId: e.target.value,
    });
  };

  onRelayTypeChange = (e) => {
    console.log('relay radio checked', e.target.value);
    this.setState({
      relayType: e.target.value,
    });
  };

  render() {
    console.log("props:", this.props);
    const RadioGroup = Radio.Group;
    const InputGroup = Input.Group;
    return (
      <div>
        <Col span={20}>
          <Col span={24} style={{marginTop: 16}}>
            <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
              <label>视频类型: </label>
            </Col>
            <Col span={18}>
              <RadioGroup onChange={this.onTaskTypeChange} defaultValue={"screen_relay"}>
                <RadioButton value={"screen_relay"}>多屏接力</RadioButton>
                <RadioButton value={"comedy"}>搞笑相声</RadioButton>
              </RadioGroup>
            </Col>
          </Col>
          <Col span={24} style={{marginTop: 16,display:this.state.taskType==="screen_relay"?"block":"none"}}>
            <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
              <label>分屏数量: </label>
            </Col>
            <Col span={18}>
              <Slider style={{width:"60%"}} min={2} max={5} defaultValue={3}
                      marks={{2: "2", 3: {style: {color: '#f50'}, label: <strong>3</strong>}, 4: "4", 5: "5"}}/>
            </Col>
          </Col>
          <Col span={24} style={{display:this.state.taskType==="screen_relay"?"block":"none"}}>
            <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
              <label>接力类型：</label>
            </Col>
            <Col span={18}>
              <RadioGroup onChange={this.onRelayTypeChange} defaultValue={1}>
                <RadioButton value={1}>顺序接力</RadioButton>
                <RadioButton value={2}>分段接力</RadioButton>
                <RadioButton value={3}>正反放</RadioButton>
              </RadioGroup>
            </Col>
          </Col>
          <Col span={24} style={{display: this.state.taskType==="screen_relay"?"none":"block", marginTop: 16}}>
            <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
              <label>视频名称: </label>
            </Col>
            <Col span={18}>
              <InputGroup compact style={{ width: '60%'}}>
                <Input style={{ width: '60%'}}
                       placeholder="请输入剧集名或ID"
                       value={this.state.videoName}
                       onChange={e => this.videoNameChanged(e)}
                       onPressEnter={e => this.searchClick(e,1)}
                       prefix={!!this.state.videoId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> : <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                />
                <Input disabled={true} style={{ width: '40%' }} value={this.state.videoId}/>
              </InputGroup>
            </Col>
          </Col>
          <Col span={24} style={{display:this.state.taskType==="screen_relay"?"none":"block", marginTop: 16}}>
            <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
              <label>视频模板: </label>
            </Col>
            <Col span={9}>
              <RadioGroup onChange={this.onTemplateChange} defaultValue={0}>
                <RadioButton value={0}>高斯模糊</RadioButton>
                <RadioButton value={1}>1</RadioButton>
                <RadioButton value={2}>2</RadioButton>
                <RadioButton value={3}>3</RadioButton>
                <RadioButton value={4}>4</RadioButton>
                <RadioButton value={5}>5</RadioButton>
                <RadioButton value={6}>6</RadioButton>
              </RadioGroup>
            </Col>
            <Col span={9}>
              <img style={{height: "360px"}} src={this.state.comedyTemplates[this.state.comedyTemplateId]} alt={""}/>
            </Col>
          </Col>
          <Col span={24} style={{textAlign: "center", marginTop: 16}}>
            <Button type={"primary"} size={"large"}>提交</Button>
          </Col>
        </Col>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('state');
  console.log(state);
  console.log("mapStateToProps search result:{}", state.search.result);
  let result;
  if (state.search.result === undefined || state.search.result["totalNo"] === undefined){
    result = {"pageNo":1,"pageSize":20,"totalNo":0,"segs":[]};
  } else {
    result = state.search.result;
  }
  return {
    result: result
  };
}

export default  connect(mapStateToProps)(SearchPage)
