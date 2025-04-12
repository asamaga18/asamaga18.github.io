import React from "react";
import './Browse.css';
import './Browse';

// App.js
import Post from './src/Post';
import { postData } from './src/postData';

/* Do not write your tweet component here, write it in the tweet.tsx file */

function Browse() {
  return (
    <div className="app">
      <h1>Twitter Clone</h1>
      <div className="feed">
        {postData.map(Post => (
          <Post
            key = {Post.id}
            sender = {Post.username}
            message = {Post.content}
            startingLikes = {Post.likes}
            timeStamp = {Post.timestamp}
          />
        ))}
      </div>
    </div>
  );
}

export default Browse;
