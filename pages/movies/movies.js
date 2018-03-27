// pages/movies/movies.js
var utils = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow:true,
    searchPanelShow:false,
    searchResult:{}
  },
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMoviesListData(inTheatersUrl, "正在热映", "inTheaters");
    this.getMoviesListData(comingSoonUrl, "即将上映", "comingSoon");
    this.getMoviesListData(top250Url, "豆瓣Top250", "top250");
  },
  getMoviesListData: function (url,categoryTitle,settedkey) {
    var that = this;
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        // console.log(res.data)
        that.processDoubanData(res.data,categoryTitle,settedkey)
      }
    })
  },
  processDoubanData: function (moviesDouban,categoryTitle,settedkey) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + "..."
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        large: subject.images.large,
        moviesId: subject.id,
        stars: utils.convertToStarsArray(subject.rating.stars)
      }
      // console.log(temp)
      movies.push(temp)
    }
    var readyKey = {};
    readyKey[settedkey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyKey)
  },
  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },
  onbindfouse:function(event){
    this.setData({
      containerShow:false,
      searchPanelShow:true
    })
  },
  onCancelImgTap:function(event){
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },
  bindconfirm:function(event){
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + text;
    this.getMoviesListData(searchUrl,"searchResult","");
  },
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movies-detail/movies-detail?id=" + movieId
    })
  }
})