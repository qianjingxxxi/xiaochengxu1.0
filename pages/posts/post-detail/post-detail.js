// pages/posts/post-detail/pot-detail.js
var postsData = require("../../../data/posts-data.js");
var app = getApp();
Page({
  data: {
    isPlayingMusic: false,

  },
  onLoad: function (options) {
    var collected;
    var postId = options.id;
    var postData = postsData.postList[postId];
    this.data.currentPostId = postId;
    this.setData({
      postData: postData
    })
    var postsCollected = wx.getStorageSync('post_Collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {}
      postsCollected[postId] = false;
      wx.setStorageSync('post_Collected', postsCollected)
    }
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMonitor();

  },
  setMusicMonitor: function (event) {
    //音乐
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic=true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic=false;
      app.globalData.g_currentMusicPostId=null;
    });
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
  },
  onCollectedTap: function (event) {
    var postsCollected = wx.getStorageSync('post_Collected');
    var postCollected = postsCollected[this.data.currentPostId];
    var collected;
    postCollected = !postCollected;//收藏变成未收藏；未收藏变成收藏
    postsCollected[this.data.currentPostId] = postCollected;
    //更新文章是否缓存
    wx.setStorageSync('post_Collected', postsCollected);
    //更新数据绑定
    this.setData({
      collected: postCollected
    });
    //用户通知
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: 'success'
    })
  },
  onShareTap: function (event) {
    var itemList = [
      "分享到微信",
      "分享到微信朋友圈",
      "分享到OO",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        console.log(itemList[res.tapIndex])
      },
      fail: function (res) {
        console.log("取消分享")
      }
    })
  },
  onMusicTap: function (event) {
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      });
      this.setData({
        isPlayingMusic: true
      })
    }


  }
})