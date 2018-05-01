//shop.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../static/script/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var key ='MJ4BZ-JFO33-S253H-YMJVM-ZPXOK-MAFFB'


Page({
  data: {
    address:'',
    searchColor:"#797979",
    currentIndex:0,
    datalist: [],
    radioItems:[{
      value:0,
      name:'现在，支付成功后在 店内取餐',
      checked:true
    }, {
      value: 1,
      name: '稍晚，预约稍晚时间 到店取餐'
    }]
  },
  onLoad(options) {
    qqmapsdk = new QQMapWX({
        key: key
    });
    //获取地址
    this.getLocato()
  },
  onReady(){
  },
  getLocato(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.getLocation({
      type: 'gps', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude//维度
        var longitude = res.longitude//经度
        _this.getLocationInfo(latitude, longitude);
      }
    })
  },
  getLocationInfo(latitude, longitude){
     let _this = this;
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function(res) {
          // this.address = res.
          if (res && res.result)  
          {
            _this.setData({
              address: res.result.address
            },()=>{
              //获取实际地址后开始获取列表
              _this.initPage();
            })
            wx.hideLoading()
          }
        },
        fail: function(res) {
          wx.showToast({
            title: res,
            icon: 'none',
            duration: 3000
          });
        },
        complete: function(res) {
          //完成
        }
     })
  },
  bindKeyInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems
    });
  },
  // 选择门店
  changeShop(e){
    let data = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index
    });
  },
  initPage(){
    let _this = this;
    //页面店铺列表
    wx.request({
      url: app.config.api + '/get/shop/list', //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if(res && res.data && res.data.data){
          let {data} = res.data;
          _this.setData({
            datalist: data
          });
        }else{
          // 提示数据为空
        }
      }
    })
  },
  selectMap(){
    //打开地图选择
    this.chooseMap();
  },
  chooseMap(){
    let _this = this;
    wx.chooseLocation({
      success: function (res) {
        if(res){
          // success
          console.log(res, "location")
          console.log(res.name)
          console.log(res.latitude)
          console.log(res.longitude)
          _this.setData({
            address: res.address
          },()=>{
            //更新页面请求
            _this.initPage()
          })
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  selectShop(){
    wx.navigateTo({
      url: '../shopList/shopList?id=1'
    });
  }
})  