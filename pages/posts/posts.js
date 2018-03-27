var postsData=require('../../data/posts-data.js');
Page({
  data: {
  
  },
  onLoad:function(){
    this.setData({
      postList: postsData.postList
    });
  },
  onPostTap:function(event){
   var postId=event.currentTarget.dataset.postid;//属性值
   wx.navigateTo({
     url: 'post-detail/post-detail?id=' + postId
   })
  }
})