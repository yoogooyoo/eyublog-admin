import React from 'react'

import ArticleDetail from '../components/article-detail'

const ArticleUpdate = (props) => {
  return (
    <ArticleDetail id={props.params.id} />
  )
}

export {
  ArticleUpdate
}