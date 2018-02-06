import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App from './containers/App'
import Login from './components/login'
import Home from './containers/Home'

const getArticles = (location, callback) => {
  require.ensure([], require => {
    const {Articles} = require('./components/articles')
    document.title = "文章列表 - Ethan"
    callback(null, Articles)
  }, 'articles')
}

const getGather = (location, callback) => {
  require.ensure([], require => {
    const {Gather} = require('./components/gather')
    document.title = '收藏列表 - Ethan'
    callback(null, Gather)
  }, 'gather')
}

const getGossip = (location, callback) => {
  require.ensure([], function (require) {
    const {Gossip} = require('./components/gossip')
    document.title = "说说列表 - Ethan"
    callback(null, Gossip)
  }, 'gossip')
}

const newArticle = (location, callback) => {
  require.ensure([], function (require) {
    const {NewArticle} = require('./containers/NewArticle')
    document.title = "添加文章 - Ethan"
    callback(null, NewArticle)
  }, 'new-article')
}

const articleUpdate = (location, callback) => {
  require.ensure([], function (require) {
    const {ArticleUpdate} = require('./containers/ArticleUpdate')
    document.title = "文章收藏 - Ethan"
    callback(null, ArticleUpdate)
  }, 'article-update')
}

const newGather = (location, callback) => {
  require.ensure([], function (require) {
    const {NewGather} = require('./containers/NewGather')
    document.title = "添加收藏 - Ethan"
    callback(null, NewGather)
  }, 'new-gather')
}

const gatherUpdate = (location, callback) => {
  require.ensure([], function (require) {
    const {GatherUpdate} = require('./containers/GatherUpdate')
    document.title = "收藏更新 - Ethan"
    callback(null, GatherUpdate)
  }, 'gather-update')
}

const gossipDetail = (location, callback) => {
  require.ensure([], function (require) {
    const {GossipDetail} = require('./containers/GossipDetail')
    document.title = "说说详情 - Ethan"
    callback(null, GossipDetail)
  }, 'gossip-detail')
}

const checkAuth = (nextState, replace, next) => {
  if (sessionStorage.user == 1) {
    next()
  } else {
    sessionStorage.user = 1
    location.href = `/checkAuth?url=${nextState.location.pathname}`
  }
}

const Routes = () => (
  <Router history={browserHistory}>
    <Route path="/login" components={Login} />
    <Route path='/' component={App} onEnter={checkAuth} >
      <IndexRoute component={Home} />
      <Route path="home" component={Home} />
      <Route path="articles" getComponent={getArticles}/>
      <Route path="gather" getComponent={getGather}/>
      <Route path="gossip" getComponent={getGossip}/>
      <Route path="new-article" getComponent={newArticle}/>
      <Route path="article-update/:id" getComponent={articleUpdate}/>
      <Route path="new-gather" getComponent={newGather}/>
      <Route path="gather-update/:id" getComponent={gatherUpdate}/>
      <Route path="new-gossip" getComponent={gossipDetail}/>
      <Route path="gossip-update/:id" getComponent={gossipDetail}/>
    </Route>
  </Router>
)

export default Routes