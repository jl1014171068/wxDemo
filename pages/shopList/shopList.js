// pages/shopList/shopList.js

//查找元素在数组中的位置
Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data:{
    scrollHeight:1160,
    currentmenuid:'custom_1',
    needDistance:0,
    pageData:[],
    currentleftmenu:0,
    goods:[],
    // 总金额
    money: 0,
    // 总数
    allCount: 0,
    //控制购物车块关闭
    cardFlag:false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //触发数据更新
    let _this = this;
    _this.initPage()
  },
  initPage(){
    let _this = this;
    wx.request({
      url: app.config.api + '/get/goods', 
      data: { y: ''},
      header: {'content-type': 'application/json'},
      success: function (res) {
        if (res && res.data && res.data.data) {
          let { data } = res.data;
          let result = _this.dataEmpty(data)
          _this.setData({
            pageData: result
          })
        } else {
          // 提示数据为空
        }
      }
    })
  },
  dataEmpty(data){
    return data.map((item) => {
      item.foods.map((list) => {
        list.count = 0
        return list
      })
      return item
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
  selectMenu(e){
    let { index } = e.currentTarget.dataset
    let { id } = e.currentTarget.dataset
    this.setData({
      currentleftmenu: index,
      currentmenuid:id
    })
  },
  handleCartComponent(setting, list, itemindex, listindex){
    let _this = this;
    let data = _this.data.pageData;
    if (setting === 'add') {
      //暂时未判断库存
      data[itemindex]['foods'][listindex].count++
    } else {
      if (list.count) {
        data[itemindex]['foods'][listindex].count--
      }
      //暂未加0提示
    }
    _this.setData({
      pageData: data
    }, () => {
      _this.renderGoods()
    })
  },
  handleCart(e){
    let _this = this;
    let { setting,list, itemindex, listindex} = e.currentTarget.dataset
    _this.handleCartComponent(setting, list, itemindex, listindex)
  },
  renderGoods(){
    //每次操作更新遍历
    let foods = [],allCount= 0 ,allPrice = 0;
    let _this = this;
    _this.data.pageData.forEach((good,index) => {
      good.foods.forEach((food,ind) => {
        if (food.count) {
          food.itemindex = index
          food.listindex = ind
          foods.push(food);
          // allCount+=food.count;
        }
      });
    })
    foods.map((item)=>{
      allCount+=item.count
      allPrice += (item.count * item.price)
    })
    _this.setData({
      goods: foods,
      allCount: allCount,
      money: allPrice
    })
  },
  onSubmit(){
    if (this.data.allCount){
      var params = {
        goods: this.data.goods,
        money: this.data.money,
        allCount: this.data.allCount
      };
      app.globalData.pageInfo = params;
      wx.navigateTo({
        url: '../shopDetail/shopDetail'
      });
    }
  },
  handleCartList(){
    let _this = this;
    //弹出已选择列表
    if (this.data.allCount) {
      let { cardFlag} = _this.data;
      _this.setData({
        cardFlag: !cardFlag
      })
    }
  },
  handleCartMin(e){
    //购物车内操作
    let _this = this;
    let { list, setting } = e.currentTarget.dataset;
    let { itemindex, listindex } = list
    _this.handleCartComponent(setting, list, itemindex, listindex)
  },


  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  }
})