// pages/movies/more-movie/more-movie.js
var app=getApp();
var utils=require("../../../utils/util.js")
Page({
  data: {
    movies:{},
    navigateTitle: "",
    totalCount:0,
    requestUrl:"",
    isEmpty: true,
  },
  onLoad: function (options) {
    var category = options.category;
    var dataUrl="";
    wx.setNavigationBarTitle({
      title: category
    });
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    utils.http(dataUrl, this.processDoubanData)
  },
  processDoubanData: function (moviesDouban) {
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
      movies.push(temp)
    }
    var totalMovie={};
    if (!this.data.isEmpty){
      totalMovie =this.data.movies.concat(movies)
    }else{
      totalMovie = movies;
      this.data.isEmpty=false;
    }
    this.setData({
      movies: totalMovie
    })
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  // onScrollLower:function(event){
  //   var nextUrl=this.data.requestUrl+"?start=" + this.data.totalCount + "&count=20";
  //   utils.http(nextUrl, this.processDoubanData)
  //   wx.showNavigationBarLoading();
  // },
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    utils.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  onPullDownRefresh:function(event){
    console.log(event)
    var refreshUrl = this.data.requestUrl+"?start=0&count=20";
    this.data.movies={};
    this.data.isEmpty=true;
    this.data.totalCount=20;
    utils.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();


    this.data.totalCount=20;
    utils.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "../movies-detail/movies-detail?id=" + movieId
    })
  }
})