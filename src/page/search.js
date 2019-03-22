import React, { Component } from 'react';
// import Link from 'umi/link';
import { connect } from 'dva';

import Player from "../assets/player.css"
import ReactHLS from 'react-hls'
import LazyLoad from "react-lazy-load"

import request from "../util/request"

import * as utils from "../util/commons"

import {
  Input,
  Modal,
  Pagination,
  Button,
  Col,
  Icon,
  Divider,
  BackTop,
  Affix,
  Drawer,
  Popconfirm,
  Radio,
  notification,
  Tag,
  Tooltip,
  Switch
} from 'antd';

class SearchPage extends Component {

  state = {
    pageSize: 20,
    checked: {},
    checkedList: [],
    highlightSegments: new Set(),
    highlightStarId: null,
    highlightAlbumId: null,
    highlightVideoId: null,
    starIdSet: new Set(),
    albumIdSet: new Set(),
    videoIdSet: new Set(),
    key: "",
    videoUrl:"",
    playerVisible: false,
    generateVisible: false,
    checkedStarDisplay: "",
    checkedAlbumDisplay: "",
    checkedVideoDisplay: "",
    checkedDurationDisplay: "",
    paginationVisible:false,
    bgmQipuId: "",
    starIdReady: false,
    starId: undefined,
    starName: "",
    albumIdReady: false,
    albumId: undefined,
    albumName: "",
    videoIdReady: false,
    videoId: undefined,
    videoName: "",
    drawerVisible: false,
    taskType: 1,
    loading: false
  };

  onTaskTypeChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      taskType: e.target.value,
    });
  };

  getColor = (qipuId, startSec) => {
    console.log("getColor");
    if(this.state.checked[qipuId + startSec]){
      return "#4EEE94 #4EEE94"
    }
    return "#c3c3c3 #c3c3c3";
  };

  componentDidMount() {
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
        playerVisible: false,
        videoUrl: ""
      }
    );
  };

  getStarIdByName = () => {
    if(this.state.starName.trim() === ""){
      this.setState({
        starId: undefined,
        starIdReady: false
      })
    } else if(!isNaN(this.state.starName)){
      this.setState({
        starId: parseInt(this.state.starName),
        starIdReady: true
      })
    } else {
      let result = request(`/apis/views/name2id?type=3&name=${this.state.starName}`);
      result.then((r) => {
        console.log("star id:", r.result.id);
        if (r.result && r.result.id && r.result.id !== 0) {
          this.setState({
            starId: r.result.id,
            starIdReady: true
          })
        } else {
          this.setState({
            starId: undefined,
            starIdReady: false
          })
        }
      });
    }
  };

  getAlbumIdByName = () => {
    if(this.state.albumName.trim() === ""){
      this.setState({
        albumId: undefined,
        albumIdReady: false
      })
    } else if(!isNaN(this.state.albumName)){
      this.setState({
        albumId: parseInt(this.state.albumName),
        albumIdReady: true
      })
    } else {
      let result = request(`/apis/views/name2id?type=1&name=${this.state.albumName}`);
      result.then((r) => {
        console.log("album id:", r.result.id);
        if (r.result && r.result.id && r.result.id !== 0) {
          this.setState({
            albumId: r.result.id,
            albumIdReady: true
          })
        } else {
          this.setState({
            albumId: undefined,
            albumIdReady: false
          })
        }
      });
    }
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

  handleCancel = (e) => {
    console.log(e);
    this.setState({
        playerVisible: false,
        videoUrl: ""
      }
    );
  };

  playVideo = (videoUrl) =>{
    console.log("videoUrl:{}", videoUrl);
    let visible;
    if(videoUrl===undefined || videoUrl === null || videoUrl === ""){
      visible = false;
    } else {
      visible = true;
    }
    this.setState({
      playerVisible: visible,
      videoUrl: videoUrl
    })
  };

  searchClick(value, pageNo) {
    this.setState({
      key: value,
      loading: true
    });
    console.log("search key:" + value);
    console.log("pageNo:" + pageNo);
    this.search(value, pageNo);
  }

  getVideoU3m8Url = (qipuId, startSec, endSec) => {
    let url = `/apis/views/play?qipuid=${qipuId}&startSec=${startSec}&endSec=${endSec}`;
    return url;
  };

  getCheckedDisplay(){
    let checkedStarDisplay = "";
    let checkedAlbumDisplay = "";
    let checkedVideoDisplay = "";
    let checkedDurationDisplay = "";
    let videoTime = 0;
    let starIdSet = new Set();
    let starNameSet = new Set();
    let starKV = {};
    let albumIdSet = new Set();
    let albumNameSet = new Set();
    let albumKV = {};
    let videoIdSet = new Set();
    let videoNameSet = new Set();
    let videoKV = {};
    let generateVisible = false;
    let checkedList = [];
    for (let key in this.state.checked){
      let video = this.state.checked[key];
      starIdSet.add(video.starId);
      starNameSet.add(video.starName||video.starId);
      starKV[video.starId] = video.starName||video.starId;
      albumIdSet.add(video.albumId === 0?video.videoId:video.albumId);
      let albumName = video.albumId === 0?(video.videoName || video.videoId):(video.albumName || video.albumId);
      albumNameSet.add(albumName);
      albumKV[video.albumId === 0?video.videoId:video.albumId] = albumName;
      videoIdSet.add(video.videoId);
      videoNameSet.add(video.videoName||video.videoId);
      videoKV[video.videoId] = video.videoName||video.videoId;
      videoTime += (video.endSec - video.startSec);
      checkedList.push({id:video.id, albumId: video.albumId, videoId: video.videoId, starId: video.starId,
        startSec: video.startSec,endSec:video.endSec,picUrl: video.picUrl,
        starName: video.starName, albumName: video.albumName, videoName: video.videoName})
    }

    console.log(JSON.stringify(this.state.checked));
    console.log(videoIdSet.size);
    if (videoIdSet.size > 0){
      console.log("starKV:",starKV);
      checkedStarDisplay = (<div>明星：{Array.from(starIdSet).map((k)=><Tag key={k} style={{color:k === this.state.highlightStarId?"#ff0000":"#00ff00"}} closable afterClose={()=>this.removeCheckedByStarId(k)} onClick={(e) => this.highlightCheckedByStarId(k)}>{starKV[k]}</Tag>)} </div>);
      checkedAlbumDisplay = (<div>专辑：{Array.from(albumIdSet).map((k)=><Tag key={k} closable afterClose={()=>this.removeCheckedByAlbumId(k)} onClick={(e) => this.highlightCheckedByAlbumId(k)}>{albumKV[k]}</Tag>)} </div>);
      checkedVideoDisplay = (<div>视频：{Array.from(videoIdSet).map((k)=><Tag key={k} closable afterClose={()=>this.removeCheckedByVideoId(k)} onClick={(e) => this.highlightCheckedByVideoId(k)}>{videoKV[k]}</Tag>)} </div>);
      checkedDurationDisplay = (<div>片段：{checkedList.length}个, 总时长：{utils.timeFormatHz(Math.floor(videoTime))}</div>);
      generateVisible = true;
    }

    console.log("checkedStarDisplay:", checkedStarDisplay);
    this.setState({
      checkedStarDisplay: checkedStarDisplay,
      checkedAlbumDisplay: checkedAlbumDisplay,
      checkedVideoDisplay: checkedVideoDisplay,
      checkedDurationDisplay: checkedDurationDisplay,
      checkedList: checkedList,
      generateVisible: generateVisible,
      starIdSet: starIdSet,
      starNameSet: starNameSet,
      albumIdSet: albumIdSet,
      albumNameSet: albumNameSet,
      videoIdSet: videoIdSet,
      videoNameSet: videoNameSet
    },()=>console.log("starIdSet:",this.state.starIdSet));

  }

  search(value, pageNo) {
    this.props.dispatch({
      type: 'search/search',
      payload: [this.state.starId, this.state.albumId, this.state.videoId, this.state.pageSize, pageNo]
    }).then(()=>this.setState({loading:false}));
  }

  onVideoCheck = (event,id, starId, albumId, videoId,  startSec, endSec, picUrl, starName, albumName, videoName) =>{
    console.log(id, albumId, videoId, starId, startSec, endSec);
    let checked = this.state.checked;
    if(checked[id]){
      delete checked[id];
    } else {
      checked[id] = {id: id, albumId: albumId, videoId: videoId, starId: starId,
        startSec: startSec, endSec: endSec, picUrl: picUrl,
        starName: starName, albumName: albumName, videoName: videoName};
    }
    this.setState({
      checked: checked,
    });
    this.getCheckedDisplay();
    console.log(this.state.checked);
    event.stopPropagation && event.stopPropagation();
  };

  onVideoUncheck = (event,id, qipuId, personId, startSec, endSec, picUrl) =>{
    console.log(id, qipuId, personId, startSec, endSec);
    let checked = this.state.checked;
    if(checked[id]){
      delete checked[id];
    } else {
    }
    this.setState({
      checked: checked
    });
    this.getCheckedDisplay();
    console.log(this.state.checked);
    event.stopPropagation();
  };

  highlightCheckedByStarId = (starId) => {
    console.log("highlight checked starId:", starId);
    this.setState({
      highlightStarId: starId,
      highlightAlbumId: null,
      highlightVideoId: null,
    },this.highlightChanged)
  };

  highlightCheckedByAlbumId = (albumId) => {
    console.log("highlight checked albumId:", albumId);
    this.setState({
      highlightStarId: null,
      highlightAlbumId: albumId,
      highlightVideoId: null,
    },this.highlightChanged)
  };

  highlightCheckedByVideoId = (videoId) => {
    console.log("highlight checked videoId:", videoId);
    this.setState({
      highlightStarId: null,
      highlightAlbumId: null,
      highlightVideoId: videoId,
    },this.highlightChanged)
  };

  highlightChanged = () => {
    let highlightSegments = new Set();
    if(this.state.starId){
      this.state.checkedList.filter((i) => i.starId === this.state.starId).forEach(
        (i) => highlightSegments.add(i.id)
      )
    } else if(this.state.albumId){
      this.state.checkedList.filter((i) => i.albumId === this.state.albumId).forEach(
        (i) => highlightSegments.add(i.id)
      )
    } else {
      this.state.checkedList.filter((i) => i.videoId === this.state.videoId).forEach(
        (i) => highlightSegments.add(i.id)
      )
    }

    this.setState({
      highlightSegments: highlightSegments
    });
  };

  removeCheckedByStarId = (starId) => {
    console.log("remove checked starId:", starId);
    let checkedList = this.state.checkedList;
    let checked = {};
    checkedList.filter((i)=>i.starId !== starId).forEach((i)=>checked[i.id] = i);
    console.log("checked after filter:", checked);
    this.setState({
      checked: checked
    },this.getCheckedDisplay);
  };

  removeCheckedByAlbumId = (albumId) => {
    console.log("remove checked albumId:", albumId);
    let checkedList = this.state.checkedList;
    let checked = {};
    checkedList.filter((i)=>i.albumId !== albumId && i.videoId !== albumId).forEach((i)=>checked[i.id] = i);
    console.log("checked after filter:", checked);
    this.setState({
      checked: checked
    },this.getCheckedDisplay);
  };

  removeCheckedByVideoId = (videoId) => {
    console.log("remove checked videoId:", videoId);
    let checkedList = this.state.checkedList;
    let checked = {};
    checkedList.filter((i)=>i.videoId !== videoId).forEach((i)=>checked[i.id] = i);
    console.log("checked after filter:", checked);
    this.setState({
      checked: checked
    },this.getCheckedDisplay);
  };

  starNameChanged = (e) => {
    console.log("starName:", e.target.value);
    this.setState({
      starName: e.target.value
    }, this.getStarIdByName)
  };

  albumNameChanged = (e) => {
    console.log("albumName:", e.target.value);
    let albumName = e.target.value;
    this.setState({
      albumName: albumName
    },this.getAlbumIdByName)
  };

  videoNameChanged = (e) => {
    console.log("videoName:", e.target.value);
    this.setState({
      videoName: e.target.value
    },this.getVideoIdByName)
  };

  bgmChanged = (e) => {
    console.log("bgmQipuId:", e.target.value);
    this.setState({
      bgmQipuId: e.target.value
    })
  };

  getGeneratePayload(){
    let videoTime = 0;
    let videoQipuIdSet = new Set();
    let personId="";
    let segList = [];
    for (let key in this.state.checked){
      let video = this.state.checked[key];
      segList.push({qipuid: video.videoId, person_id: video.starId, start_sec: video.startSec, end_sec: video.endSec});
    }
    let result = true;
    if (videoQipuIdSet.size > 1){
      result = false;
      Modal.error({
        title: "Error",
        content: "不能选择多个奇谱ID",
        okText: "确认"
      });
    }

    if (this.state.taskType === 1){
      if (videoTime < 60){
        result = false;
        Modal.error({
          title: "Error",
          content: "选择的视频片段时长不能小于一分钟",
          okText: "确认"
        });
      }
    } else {
      if (this.state.starIdSet.size > 1) {
        result = false;
        Modal.error({
          title: "Error",
          content: "3in1 任务不支持多个明星",
          okText: "确认"
        });
      }
    }

    if (result) {
      if(this.state.taskType === 1){
        return {qipuid: Array.from(videoQipuIdSet).pop(), bgm_qipuid: parseInt(this.state.bgmQipuId), person_id: personId, seg_list: segList};
      } else {
        let result = {};
        console.log("album id set:",this.state.albumIdSet);
        return {album_id: Array.from(this.state.albumIdSet).pop(), seg_list: segList}
      }

    } else {
      return null;
    }
  }

  onGenerateClick = () => {
    let payload = this.getGeneratePayload();
    console.log("create job payload:", payload);
    if (payload) {
      if(this.state.taskType === 1) {
        console.log("shot video");
        this.props.dispatch({
          type: 'search/createJob',
          payload: payload
        });
      } else {
        console.log("shot video 3 in 1");
        this.props.dispatch({
          type: 'search/createJob3in1',
          payload: payload
        }).then(() => {
          this.onCleanCheck();
          this.setState({drawerVisible: false});
          this.openNotification("恭喜","任务提交成功");
        });
      }
    }
  };

  onCleanCheck = () => {
    this.cleanChecked();
  };

  cleanChecked = () => {
    this.setState({
      checked: {},
    },()=>{
      this.getCheckedDisplay();
    });
  };

  openNotification = (title, desc) => {
    notification.open({
      message: title,
      description: desc,
      icon: <Icon type="smile" style={{ color: '#108ee9' }} />
    });
  };

  onPageChange = (pageNo, pageSize) => {
    console.log(pageNo, pageSize);
    this.search(this.state.key,pageNo);
  };

  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
    this.setState({
      pageSize: pageSize
    },() => this.onPageChange(current, pageSize));
  };

  render() {
    console.log("props:", this.props);
    const { result = {"pageNo":1,"pageSize":20,"totalNo":0,"segs":[]}} = this.props;
    const { TextArea } = Input;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const RadioGroup = Radio.Group;
    return (
      <div>
        <Col span={18} style={{paddingRight:"4px"}}>
          <div>
            <Col span={23}>
              <Col span={8} style={{paddingRight:"8px"}}>
                <Input.Group compact>
                  <Input style={{ width: '60%' }}
                         placeholder="请输入明星姓名或ID"
                         value={this.state.starName}
                         onChange={e => this.starNameChanged(e)}
                         onPressEnter={e => this.searchClick(e,1)}
                         prefix={!!this.state.starId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> : <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                  />
                  <Input disabled={true} style={{ width: '40%'}} value={this.state.starId}/>
                </Input.Group>
              </Col>
              <Col span={8} style={{paddingRight:"8px"}}>
                <Input.Group compact>
                  <Input style={{ width: '60%' }}
                         placeholder="请输入专辑名或ID"
                         value={this.state.albumName}
                         onChange={e => this.albumNameChanged(e)}
                         onPressEnter={e => this.searchClick(e,1)}
                         prefix={!!this.state.albumId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> : <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                  />
                  <Input disabled={true} style={{ width: '40%' }} value={this.state.albumId}/>
                </Input.Group>
              </Col>
              <Col span={8} style={{paddingRight:"8px"}}>
                <Input.Group compact>
                  <Input style={{ width: '60%' }}
                         placeholder="请输入剧集名或ID"
                         value={this.state.videoName}
                         onChange={e => this.videoNameChanged(e)}
                         onPressEnter={e => this.searchClick(e,1)}
                         prefix={!!this.state.videoId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> : <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                  />
                  <Input disabled={true} style={{ width: '40%' }} value={this.state.videoId}/>
                </Input.Group>
              </Col>
            </Col>
            <Col span={1}>
              <Button type={"primary"} icon={"search"} onClick={value => this.searchClick(value,1) } loading={this.state.loading}/>
            </Col>
            <div style={{clear:"both"}}/>
            {/*<Search*/}
              {/*placeholder="请输入关键字"*/}
              {/*size={"large"}*/}
              {/*onSearch={value => this.searchClick(value,1)}*/}
              {/*enterButton*/}
            {/*/>*/}
            <hr style={{color:"darkgray"}}/>
          </div>

          <div style={{float:"left",width:"100%"}}>
            <div style={{clear:"both"}}/>
            <div style={{align:"right",position:"relative",height:"30px"}}>
              <Pagination hideOnSinglePage={true} showSizeChanger onShowSizeChange={this.onShowSizeChange}
                          onChange={this.onPageChange} pageSizeOptions={["20","50","100"]} current={result.pageNo}
                          style={{position:"absolute",right:"10px"}}
                          defaultPageSize={result.pageSize} defaultCurrent={result.pageNo} total={result.totalNo} />
            </div>
            <div style={{width:"100%", padding:"24px", backgroundColor:"#d2d2d2", display:result["segs"].length === 0 ?"block":"none",textAlign:"center"}}>
              没有数据
            </div>
            <div style={{margin:"6px 0px"}}>
            {result["segs"].map(v =>
              <div style={{float:"left",border:"1px solid #d3d3d3",margin:"2px",backgroundColor:"#e6e6e6"}}>
                <div>
                  <a
                    style={{ position:"relative",align:"center", width: 280, height: 158, margin: '8px',float:"left" ,border:"solid 1px #c3c3c3",backgroundColor:"#e3e3e3"}}
                    onClick={()=>{window.open("player.html?qipuId=" + v.qipuId + "&startSec=" + v.startSec + "&endSec=" + v.endSec,"_blank")}}
                    key={v.qipuId + v.startSec}
                  >
                    <div style={{position:"static",top:"0px",left:"0px"}}>
                      <div style={{position:"absolute",top:"50px",left:"110px",
                        display:"block",opacity: 0.8,zIndex:9
                      }}>
                        <Icon type={"play-circle"} style={{fontSize:"4em"}}/>
                      </div>
                      <LazyLoad>
                        <img alt="no image" src={v.picUrl||"http://bestanimations.com/Science/Gears/loadinggears/loading-gears-animation-10.gif"}
                             style={{maxWidth: "100%", maxHeight: "100%",position:"absolute"}}/>
                      </LazyLoad>
                      <div style={{fontSize:"1.1em",position:"absolute",left:"4px",bottom:"4px",}}>
                        <span style={{marginLeft:"4px",backgroundColor:"#3a3a3a",color:'rgba(0,213,0,.85)',opacity:0.8}}>
                          {utils.timeFormat(v.startSec)}~{utils.timeFormat(v.endSec)}
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
                <div style={{padding:"6px"}}>
                  <Col span={20}>
                    <Tooltip placement={"top"} title={v.starName || v.starId}>
                      <Tag><Icon type={"user"}/>{utils.cropStringByLength(((v.starName || v.starId) + ""), 10)}</Tag>
                    </Tooltip>
                    <Tooltip placement={"top"} title={v.videoName || v.qipuId}>
                      <Tag>{utils.cropStringByLength(((v.videoName || v.qipuId) + ""), 16)}</Tag>
                    </Tooltip>
                  </Col>
                  <Col span={4}>
                    <Switch checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            size={"small"}
                            onChange={(e)=>this.onVideoCheck(e, v.id, v.starId, v.albumId, v.qipuId, v.startSec, v.endSec, v.picUrl, v.starName, v.albumName, v.videoName)}
                            checked={!!this.state.checked[v.id]}
                    />
                  </Col>
                  <div style={{clear:"both"}}/>
                </div>
              </div>
            )}
            <div style={{clear:"both"}}/>
            </div>
            <div style={{align:"right",position:"relative",height:"30px"}}>
              <Pagination hideOnSinglePage={true} showSizeChanger onShowSizeChange={this.onShowSizeChange}
                          onChange={this.onPageChange} pageSizeOptions={["20","50","100"]} current={result.pageNo}
                          pageSize={result.pageSize}
                          style={{position:"absolute",right:"10px"}}
                          defaultPageSize={20} defaultCurrent={1} total={result.totalNo} />
            </div>
            <Modal
              visible={this.state.playerVisible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              afterClose={() => {console.log("afterClose");this.setState({videoUrl:""})}}
              style={{margin:0,border:"none"}}
              wrapClassName={Player}
              bodyStyle={{backgroundColor:"#1c1c1c",marginLeft:"auto",marginRight:"auto",padding:"0px"}}
              width={"60%"}
              centered={true}
              closable={true}
              footer={null}
              maskStyle={{backgroundColor:"#1c1c1c",opacity:0.9}}
            >
              <ReactHLS width={"100%"} height={"100%"} url={this.state.videoUrl + "#t=10,20"} autoplay={true} controls={"controls"}/>
            </Modal>
          </div>
        </Col>
        <Col span={6}>
          <Affix offsetTop={2}>
            <div style={{borderLeft:"2px solid #40a9ff",paddingLeft:"4px"}}>
              <h2 align="center" style={{color:"#40a9ff"}}>集锦生产</h2>
              <Divider orientation="left" style={{margin:"8px 0px"}}/>
              <div style={{fontSize:"1.1em"}}>
                <div style={{display: this.state.checkedDurationDisplay ? "block":"none"}}>
                  已选择：
                </div>
                <div style={{paddingLeft:"10px"}}>
                  <div>
                    {
                      this.state.checkedDurationDisplay
                    }
                  </div>
                  <div>
                    {
                      this.state.checkedStarDisplay
                    }
                  </div>
                  <div>
                    {
                      this.state.checkedAlbumDisplay
                    }
                  </div>
                  <div>
                    {
                      this.state.checkedVideoDisplay
                    }
                  </div>
                </div>
              </div>
              <div style={{display:this.state.generateVisible?"none":"block"}}>
                <h3><Icon type={"arrow-left"}/>请先在左侧搜索和选择视频片段</h3>
              </div>
              <div style={{display:this.state.generateVisible?"block":"none"}}>
                <Col span={24}>
                  <Col span={12} style={{padding:"10px 0 10px 0",align:"center"}}>
                    <Popconfirm title={"确认要清空？"} onConfirm={() => this.onCleanCheck()} okText="确认" cancelText="取消">
                      <Button icon={"delete"} size={"large"} >清空</Button>
                    </Popconfirm>
                  </Col>
                  <Col span={12} style={{padding:"10px 0 10px 0"}}>
                    <Button size={"large"} icon={"arrow-right"} type={"primary"}
                            onClick={() => {this.setState({drawerVisible:true})}}
                    >下一步</Button>
                  </Col>
                </Col>
              </div>
              <div style={{clear:"both"}}/>
              <Divider/>
              <div style={{display:this.state.generateVisible?"block":"none",float:"left",width:"100%",maxHeight:'500px',overflowY:'scroll'}}>
                {this.state.checkedList.map(v => <a
                  style={{ position:"relative",align:"center", width: 170, height: 95, margin: '8px',float:"left" ,border:"solid 1px #c3c3c3",backgroundColor:"#e3e3e3"}}
                  onClick={() => this.playVideo(this.getVideoU3m8Url(v.videoId,v.startSec,v.endSec))}
                  key={v.id}
                >
                  <div style={{position:"absolute",top:"0px", right:"0px",
                    display:this.state.checked[v.id]?"block":"none",zIndex:99,color:"#ee3333"
                  }}
                       onClick={(e)=>this.onVideoUncheck(e, v.id, v.qipuId,v.personId, v.startSec, v.endSec, v.picUrl)}>
                    <Icon type="close" style={{fontSize:"1.2em"}}/>
                  </div>
                  <div style={{position:"static",top:"0px",left:"0px"}}>
                    <div style={{position:"absolute",top:"30px",left:"50px",
                      display:"block",opacity: 0.8,zIndex:9
                    }}>
                      <Icon type={"play-circle"} style={{fontSize:"3em"}}/>
                    </div>
                    <img alt="no image" src={v.picUrl||"http://bestanimations.com/Science/Gears/loadinggears/loading-gears-animation-10.gif"}
                         style={{maxWidth: "100%", maxHeight: "100%",position:"absolute"}}/>
                    <div style={{fontSize:"1.1em",position:"absolute",left:"10px",bottom:"20px",}}>
                      <span style={{backgroundColor:"#3a3a3a",color:"#ffffff",opacity:0.7}}>
                        #{v.qipuId}
                      </span>
                      <span style={{marginLeft:"4px",backgroundColor:"#3a3a3a",color:"#ffffff",opacity:0.7}}>
                        {utils.timeFormat(v.startSec)}~{utils.timeFormat(v.endSec)}
                      </span>
                    </div>
                  </div>
                </a>)}
              </div>
              <div style={{clear:"both"}}/>
            </div>
          </Affix>
          <Drawer
            visible={this.state.drawerVisible}
            placement={"bottom"}
            onClose={() => this.setState({drawerVisible:false})}
            height={400}
          >
            <div style={{display:this.state.generateVisible?"block":"none"}}>
              <Col span={24}>
                <Col span={18}>
                  <Input placeholder="给集锦取个名字吧" onChange={value => this.bgmChanged(value)}/>
                </Col>
                <Col span={24} style={{padding:"10px 0 10px 0"}}>
                  <TextArea placeholder="给集锦写个简介吧" onChange={value => this.bgmChanged(value)} autosize={{ minRows: 3, maxRows: 8 }}/>
                </Col>
                <Col span={18}>
                  <Input placeholder="背景音乐奇谱ID" onChange={value => this.bgmChanged(value)}/>
                </Col>
                <Col span={24}>
                  <RadioGroup onChange={this.onTaskTypeChange} value={this.state.taskType}>
                    <Radio style={radioStyle} value={1}>横屏</Radio>
                    <Radio style={radioStyle} value={2}>竖屏3in1</Radio>
                  </RadioGroup>
                </Col>
                <Col span={12} style={{padding:"10px 0 10px 0",align:"center"}}>
                  <Button icon={"close"} size={"large"} onClick={() => this.setState({drawerVisible:false})}
                  >取消</Button>
                </Col>
                <Col span={12} style={{padding:"10px 0 10px 0"}}>
                  <Button size={"large"} icon={"check"} type={"primary"}
                          onClick={() => this.onGenerateClick()}
                  >提交生产任务</Button>
                </Col>
              </Col>
            </div>
          </Drawer>
        </Col>
        <div>
          <BackTop/>
        </div>
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
