//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    currentIndex:0
  },
  changeTab(e){
    let {index} = e.currentTarget.dataset;
    this.setData({
      currentIndex:index
    })
  },
  goStart(){
    wx.navigateTo({
      url: '../shop/shop'
    });
  }
  
})